import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapHeatmapLayer.js";

describe("ui5-geomap-heatmap-layer", () => {
    beforeEach(() => {
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
        it("tests color property", () => {
            cy.mount(html`<ui5-geomap-heatmap-layer color="green"></ui5-geomap-heatmap-layer>`).as("geomapheatmaplayer");

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);
                const paintProperties = heatmapLayer.paintProperties;

                // Assert
                expect(paintProperties["heatmap-color"]).to.equal("green");

                // Act
                cy.log("Change color to 'red'");
                heatmapLayer.setAttribute("color", "red");
            });

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);
                const paintProperties = heatmapLayer.paintProperties;

                // Assert
                expect(paintProperties["heatmap-color"]).to.equal("red");
            });
        });

        it("tests weight property", () => {
            cy.mount(html`<ui5-geomap-heatmap-layer weight="1"></ui5-geomap-heatmap-layer>`).as("geomapheatmaplayer");

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);
                const paintProperties = heatmapLayer.paintProperties;

                // Assert
                expect(paintProperties["heatmap-weight"]).to.equal(1);

                // Act
                cy.log("Change weight to '2'");
                heatmapLayer.setAttribute("weight", 2);
            });

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);
                const paintProperties = heatmapLayer.paintProperties;

                // Assert
                expect(paintProperties["heatmap-weight"]).to.equal(2);
            });
        });

        it("tests radius property", () => {
            cy.mount(html`<ui5-geomap-heatmap-layer radius="1"></ui5-geomap-heatmap-layer>`).as("geomapheatmaplayer");

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);
                const paintProperties = heatmapLayer.paintProperties;

                // Assert
                expect(paintProperties["heatmap-radius"]).to.equal(1);

                // Act
                cy.log("Change radius to '2'");
                heatmapLayer.setAttribute("radius", 2);
            });

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);
                const paintProperties = heatmapLayer.paintProperties;

                // Assert
                expect(paintProperties["heatmap-radius"]).to.equal(2);
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-heatmap-layer opacity="0.5"></ui5-geomap-heatmap-layer>`).as("geomapheatmaplayer");

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);
                const paintProperties = heatmapLayer.paintProperties;

                // Assert
                expect(paintProperties["heatmap-opacity"]).to.equal(0.5);

                // Act
                cy.log("Change opacity to '0.2'");
                heatmapLayer.setAttribute("opacity", 0.2);
            });

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);
                const paintProperties = heatmapLayer.paintProperties;

                // Assert
                expect(paintProperties["heatmap-opacity"]).to.equal(0.2);
            });
        });
    });
    describe("test methods", () => {
        it("tests layerType", () => {
            cy.mount(html`<ui5-geomap-heatmap-layer></ui5-geomap-heatmap-layer>`).as("geomapheatmaplayer");

            cy.get("@geomapheatmaplayer").then(($heatmapLayer) => {
                // Arrange
                const heatmapLayer = $heatmapLayer.get(0);

                // Act
                const result= heatmapLayer.layerType;

                // Assert
                expect(result).to.equal("heatmap");

            });

        });
    });
});