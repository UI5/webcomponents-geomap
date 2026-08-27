import { html } from "lit";
import "../../src/GeomapLineLayerState.js";

describe("ui5-geomap-line-layer-state", () => {
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
            cy.mount(html`<ui5-geomap-line-layer-state name="myName"></ui5-geomap-line-layer-state>`).as("geomaplinelayerstate");


            cy.get("@geomaplinelayerstate").then(($geolinelayerstate) => {
                // Arrange
                const geolinelayerstate = $geolinelayerstate.get(0);
                const state = geolinelayerstate._state;

                // Assert
                expect(state["name"]).to.equal("myName");

                // Act
                cy.log("Change name to yourName");
                geolinelayerstate.setAttribute("name", "yourName");
            });

            cy.get("@geomaplinelayerstate").then(($geolinelayerstate) => {
                // Arrange
                const geolinelayerstate = $geolinelayerstate.get(0);
                const state = geolinelayerstate._state;

                // Assert
                expect(state["name"]).to.equal("yourName");
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-line-layer-state opacity="0.6"></ui5-geomap-line-layer-state>`).as("geomaplinelayerstate");


            cy.get("@geomaplinelayerstate").then(($geolinelayerstate) => {
                // Arrange
                const geolinelayerstate = $geolinelayerstate.get(0);
                const state = geolinelayerstate._state;

                // Assert
                expect(state["opacity"]).to.equal(0.6);

                // Act
                cy.log("Change opacity to 0.7");
                geolinelayerstate.setAttribute("opacity", 0.7);
            });

            cy.get("@geomaplinelayerstate").then(($geolinelayerstate) => {
                // Arrange
                const geolinelayerstate = $geolinelayerstate.get(0);
                const state = geolinelayerstate._state;

                // Assert
                expect(state["opacity"]).to.equal(0.7);
            });
        });

        it("tests color property", () => {
            cy.mount(html`<ui5-geomap-line-layer-state color="red"></ui5-geomap-line-layer-state>`).as("geomaplinelayerstate");


            cy.get("@geomaplinelayerstate").then(($geolinelayerstate) => {
                // Arrange
                const geolinelayerstate = $geolinelayerstate.get(0);
                const state = geolinelayerstate._state;

                // Assert
                expect(state["color"]).to.equal("red");

                // Act
                cy.log("Change color to gren");
                geolinelayerstate.setAttribute("color", "green");
            });

            cy.get("@geomaplinelayerstate").then(($geolinelayerstate) => {
                // Arrange
                const geolinelayerstate = $geolinelayerstate.get(0);
                const state = geolinelayerstate._state;

                // Assert
                expect(state["color"]).to.equal("green");
            });
        });

        it("tests width property", () => {
            cy.mount(html`<ui5-geomap-line-layer-state width="30"></ui5-geomap-line-layer-state>`).as("geomaplinelayerstate");


            cy.get("@geomaplinelayerstate").then(($geolinelayerstate) => {
                // Arrange
                const geolinelayerstate = $geolinelayerstate.get(0);
                const state = geolinelayerstate._state;

                // Assert
                expect(state["width"]).to.equal(30);

                // Act
                cy.log("Change width to 40");
                geolinelayerstate.setAttribute("width", 40);
            });

            cy.get("@geomaplinelayerstate").then(($geolinelayerstate) => {
                // Arrange
                const geolinelayerstate = $geolinelayerstate.get(0);
                const state = geolinelayerstate._state;

                // Assert
                expect(state["width"]).to.equal(40);
            });
        });

    });
});
