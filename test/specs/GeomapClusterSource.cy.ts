import { html } from "lit";
import "../../src/GeomapClusterSource.js";
import { Map } from "../../src/MapLibre.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("ui5-geomap-cluster-source", () => {
    beforeEach(() => {
		setWorkerUrl("dummy");
        cy.intercept("GET", "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/*", {
            fixture: "ArcGIS_Streets.json",
            log: false
        }).as("style");
        cy.intercept("GET", "https://basemaps-api.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer?*", {
            fixture: "VectorTileServer.json",
            log: false
        }).as("vectorTileServer");
        cy.intercept("GET", /VectorTileServer\/tile.*$/, {
            body: "mocked",
            log: false
        }).as("vectorTileServer/pbfs");
        cy.intercept("GET", "https://cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/sprites/sprite.json?*", {
            fixture: "sprite.json",
            log: false
        }).as("sprite.json");
        cy.intercept("GET", "https://cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/sprites/sprite.png?*", {
            fixture: "sprite.png",
            log: false
        }).as("sprite.png");
        cy.intercept("GET", "https://cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/sprites/sprite@2x.json?*", {
            fixture: "sprite.json",
            log: false
        }).as("sprite@2x.json");
        cy.intercept("GET", "https://cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/sprites/sprite@2x.png?*", {
            fixture: "sprite.png",
            log: false
        }).as("sprite@2x.png");
    });

    describe("test properties", () => {
        it("tests clusterMinPoints property", () => {
            cy.mount(html`<ui5-geomap-cluster-source cluster-min-points="3"></ui5-geomap-cluster-source>`).as("geomapclustersource");


            cy.get("@geomapclustersource").then(($geoclustersource) => {
                // Arrange
                const geoclustersource = $geoclustersource.get(0);
                const state = geoclustersource._state;

                // Assert
                expect(state["clusterMinPoints"]).to.equal(3);

                // Act
                cy.log("Change clusterMinPoints to 2");
                geoclustersource.setAttribute("cluster-min-points", 2);
            });

            cy.get("@geomapclustersource").then(($geocirclelayerstate) => {
                // Arrange
                const geoclustersource = $geocirclelayerstate.get(0);
                const state = geoclustersource._state;

                // Assert
                expect(state["clusterMinPoints"]).to.equal(2);
            });
        });

        it("tests clusterRadius property", () => {
            cy.mount(html`<ui5-geomap-cluster-source cluster-radius="3"></ui5-geomap-cluster-source>`).as("geomapclustersource");


            cy.get("@geomapclustersource").then(($geoclustersource) => {
                // Arrange
                const geoclustersource = $geoclustersource.get(0);
                const state = geoclustersource._state;

                // Assert
                expect(state["clusterRadius"]).to.equal(3);

                // Act
                cy.log("Change clusterRadius to 2");
                geoclustersource.setAttribute("cluster-radius", 2);
            });

            cy.get("@geomapclustersource").then(($geocirclelayerstate) => {
                // Arrange
                const geoclustersource = $geocirclelayerstate.get(0);
                const state = geoclustersource._state;

                // Assert
                expect(state["clusterRadius"]).to.equal(2);
            });
        });

        it("tests clusterMaxZoom property", () => {
            cy.mount(html`<ui5-geomap-cluster-source cluster-max-zoom="3"></ui5-geomap-cluster-source>`).as("geomapclustersource");


            cy.get("@geomapclustersource").then(($geoclustersource) => {
                // Arrange
                const geoclustersource = $geoclustersource.get(0);
                const state = geoclustersource._state;

                // Assert
                expect(state["clusterMaxZoom"]).to.equal(3);

                // Act
                cy.log("Change clusterMaxZoom to 2");
                geoclustersource.setAttribute("cluster-max-zoom", 2);
            });

            cy.get("@geomapclustersource").then(($geocirclelayerstate) => {
                // Arrange
                const geoclustersource = $geocirclelayerstate.get(0);
                const state = geoclustersource._state;

                // Assert
                expect(state["clusterMinPoints"]).to.equal(2);
            });
        });
    });
    describe("test methods", () => {
        it("tests createOptions method", () => {
            cy.mount(html`<ui5-geomap-cluster-source cluster-max-zoom="1" cluster-radius="2" cluster-min-points="3"></ui5-geomap-cluster-source>`).as("geomapclustersource");

            cy.get("@geomapclustersource").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);

                // Act
                const options = geocirclelayerstate.createOptions;

                // Assert
                expect(options.cluster).to.equal(true);
                expect(options.clusterMaxZoom).to.equal(1);
                expect(options.clusterRadius).to.equal(2);
                expect(options.clusterMinPoints).to.equal(3);
            });
        });

        it("tests getClusters method", () => {
            cy.mount(html`<ui5-geomap-cluster-source></ui5-geomap-cluster-source>`).as("geomapclustersource");

            cy.get("@geomapclustersource").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);

                // Act
                let clusters = geocirclelayerstate.getClusters();

                // Assert
                expect(Array.isArray(clusters)).to.equal(true);
                expect(clusters.length).to.equal(0);

                // Arrange
                const feature = {
                    type: "Feature",
                    properties: {
                        cluster: true,
                        cluster_id: 14,
                        point_count: 3,
                        point_count_abbreviated: 3
                    }
                };
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                geocirclelayerstate.map = map;
                cy.stub(map, "getSource").returns("source");
                cy.stub(map, "querySourceFeatures").returns([feature]);

                // Act
                clusters = geocirclelayerstate.getClusters();

                // Assert
                expect(Array.isArray(clusters)).to.equal(true);
                expect(clusters).to.have.length(1);
                expect(clusters[0].feature).to.equal(feature);
                expect(clusters[0].map).to.equal(map);
                expect(clusters[0].source).to.equal("source");
            });
        });
    });
});
