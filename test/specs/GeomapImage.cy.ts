import { html } from "lit";
import "../../src/Geomap.js"
import "../../src/GeomapProvider.js";
import "../../src/GeomapImage.js";
import "../../src/GeomapPoint.js";
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("ui5-geomap-image", () => {
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
        cy.mount(html`
                <ui5-geomap-image id="sapGeomapImage" opacity="0.2">
                    <ui5-geomap-point lng="11" lat="51"></ui5-geomap-point>
                    <ui5-geomap-point lng="13.75" lat="51"></ui5-geomap-point>
                    <ui5-geomap-point lng="12.86" lat="50.2"></ui5-geomap-point>
                    <ui5-geomap-point lng="11" lat="50"></ui5-geomap-point>
                </ui5-geomap-image>`).as("geomapimage");
        });

    describe("test properties", () => {
        it("tests url property", () => {
            cy.mount(html`<ui5-geomap-image url="www.myUrl.com"></ui5-geomap-image>`).as("geomapimage");


            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);
                const state = geoimage._state;

                // Assert
                expect(state["url"]).to.equal("www.myUrl.com");

                // Act
                cy.log("Change url to www.yourUrl.com");
                geoimage.setAttribute("url", "www.yourUrl.com");
            });

            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);
                const state = geoimage._state;

                // Assert
                expect(state["url"]).to.equal("www.yourUrl.com");
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-image opacity="0.6"></ui5-geomap-image>`).as("geomapimage");


            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);
                const state = geoimage._state;

                // Assert
                expect(state["opacity"]).to.equal(0.6);

                // Act
                cy.log("Change opacity to 0.7");
                geoimage.setAttribute("opacity", 0.7);
            });

            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);
                const state = geoimage._state;

                // Assert
                expect(state["opacity"]).to.equal(0.7);
            });
        });
    });

    describe("test methods", () => {
        it("tests layerSource method", () => {

            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);

                // Act
                geoimage.layerSource

            });
        });

        // it("tests onAfterRendering method", () => {

        //     cy.get("@geomapimage").then(($geoimage) => {
        //         // Arrange
        //         const geoimage = $geoimage.get(0);
        //         cy.stub(geoimage, "whenMapConnected");
        //         cy.spy(geoimage, "updateSource");

        //         // Act
        //         geoimage.onAfterRendering();

        //         // Assert

        //         expect(geoimage.whenMapConnected.called).to.be.equal(true);
        //         expect(geoimage.updateSource.called).to.be.equal(true);

        //     });
        // });

        it("tests layerType method", () => {

            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);

                // Act
                const layertype = geoimage.layerType;

                // Assert
                expect(layertype).to.be.equal("raster");

            });
        });

        it("tests coordinates method", () => {

            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);

                // Act
                const coordinates = geoimage.coordinates;

                // Assert
                expect(coordinates.length).to.be.equal(4);
                expect(coordinates[0][0]).to.be.equal(11);
                expect(coordinates[0][1]).to.be.equal(51);
                expect(coordinates[1][0]).to.be.equal(13.75);
                expect(coordinates[1][1]).to.be.equal(51);
                expect(coordinates[2][0]).to.be.equal(12.86);
                expect(coordinates[2][1]).to.be.equal(50.2);
                expect(coordinates[3][0]).to.be.equal(11);
                expect(coordinates[3][1]).to.be.equal(50);

            });
        });

        it("tests paintProperties method", () => {
            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);

                // Act
                const paintProperties = geoimage.paintProperties;

                // Assert
                expect(paintProperties["raster-opacity"]).to.be.equal(0.2);
                expect(paintProperties["raster-fade-duration"]).to.be.equal(0);


            });
        });

        it("tests updateSource method", () => {
            cy.get("@geomapimage").then(($geoimage) => {
                // Arrange
                const geoimage = $geoimage.get(0);
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                geoimage.map = map;
                let coordcount = 0;
                let updateimagecount = 0
                map.getSource = () => {
                    return {
                        setCoordinates: () => {coordcount++;},
                        updateImage: () => {updateimagecount++;}
                    }
                }

                // Act
                geoimage.updateSource();

                // Assert
                expect(coordcount).to.be.equal(1);
                expect(updateimagecount).to.be.equal(1);
            });
        });

    });
});
