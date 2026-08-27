import { html } from "lit";
import "../../src/GeomapFillLayerState.js";

describe("ui5-geomap-fill-layer-state", () => {
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
        it("tests name property", () => {
            cy.mount(html`<ui5-geomap-fill-layer-state name="myName"></ui5-geomap-fill-layer-state>`).as("geomapfilllayerstate");


            cy.get("@geomapfilllayerstate").then(($geofilllayerstate) => {
                // Arrange
                const geofilllayerstate = $geofilllayerstate.get(0);
                const state = geofilllayerstate._state;

                // Assert
                expect(state["name"]).to.equal("myName");

                // Act
                cy.log("Change name to yourName");
                geofilllayerstate.setAttribute("name", "yourName");
            });

            cy.get("@geomapfilllayerstate").then(($geofilllayerstate) => {
                // Arrange
                const geofilllayerstate = $geofilllayerstate.get(0);
                const state = geofilllayerstate._state;

                // Assert
                expect(state["name"]).to.equal("yourName");
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-fill-layer-state opacity="0.6"></ui5-geomap-fill-layer-state>`).as("geomapfilllayerstate");


            cy.get("@geomapfilllayerstate").then(($geofilllayerstate) => {
                // Arrange
                const geofilllayerstate = $geofilllayerstate.get(0);
                const state = geofilllayerstate._state;

                // Assert
                expect(state["opacity"]).to.equal(0.6);

                // Act
                cy.log("Change opacity to 0.7");
                geofilllayerstate.setAttribute("opacity", 0.7);
            });

            cy.get("@geomapfilllayerstate").then(($geofilllayerstate) => {
                // Arrange
                const geofilllayerstate = $geofilllayerstate.get(0);
                const state = geofilllayerstate._state;

                // Assert
                expect(state["opacity"]).to.equal(0.7);
            });
        });

        it("tests outlineColor property", () => {
            cy.mount(html`<ui5-geomap-fill-layer-state outline-color="red"></ui5-geomap-fill-layer-state>`).as("geomapfilllayerstate");


            cy.get("@geomapfilllayerstate").then(($geofilllayerstate) => {
                // Arrange
                const geofilllayerstate = $geofilllayerstate.get(0);
                const state = geofilllayerstate._state;

                // Assert
                expect(state["outlineColor"]).to.equal("red");

                // Act
                cy.log("Change outline-color to green");
                geofilllayerstate.setAttribute("outline-color", "green");
            });

            cy.get("@geomapfilllayerstate").then(($geofilllayerstate) => {
                // Arrange
                const geofilllayerstate = $geofilllayerstate.get(0);
                const state = geofilllayerstate._state;

                // Assert
                expect(state["outlineColor"]).to.equal("green");
            });
        });

        it("tests fillColor property", () => {
            cy.mount(html`<ui5-geomap-fill-layer-state fill-color="blue"></ui5-geomap-fill-layer-state>`).as("geomapfilllayerstate");


            cy.get("@geomapfilllayerstate").then(($geofilllayerstate) => {
                // Arrange
                const geofilllayerstate = $geofilllayerstate.get(0);
                const state = geofilllayerstate._state;

                // Assert
                expect(state["fillColor"]).to.equal("blue");

                // Act
                cy.log("Change fill-color to yellow");
                geofilllayerstate.setAttribute("fill-color", "yellow");
            });

            cy.get("@geomapfilllayerstate").then(($geofilllayerstate) => {
                // Arrange
                const geofilllayerstate = $geofilllayerstate.get(0);
                const state = geofilllayerstate._state;

                // Assert
                expect(state["fillColor"]).to.equal("yellow");
            });
        });

    });
});
