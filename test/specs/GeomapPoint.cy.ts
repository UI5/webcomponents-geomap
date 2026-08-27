import { html } from "lit";
import "../../src/GeomapPoint.js";

describe("ui5-geomap-point", () => {
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
        it("tests lng property", () => {
            cy.mount(html`<ui5-geomap-point lng="3"></ui5-geomap-point>`).as("geomappoint");


            cy.get("@geomappoint").then(($geopoint) => {
                // Arrange
                const geopoint = $geopoint.get(0);
                const state = geopoint._state;

                // Assert
                expect(state["lng"]).to.equal(3);

                // Act
                cy.log("Change lng to 4");
                geopoint.setAttribute("lng", "4");
            });

            cy.get("@geomappoint").then(($geopoint) => {
                // Arrange
                const geopoint = $geopoint.get(0);
                const state = geopoint._state;

                // Assert
                expect(state["lng"]).to.equal(4);
            });
        });

        it("tests lat property", () => {
            cy.mount(html`<ui5-geomap-point lat="2.6"></ui5-geomap-point>`).as("geomappoint");


            cy.get("@geomappoint").then(($geopoint) => {
                // Arrange
                const geopoint = $geopoint.get(0);
                const state = geopoint._state;

                // Assert
                expect(state["lat"]).to.equal(2.6);

                // Act
                cy.log("Change lat to 3.7");
                geopoint.setAttribute("lat", 3.7);
            });

            cy.get("@geomappoint").then(($geopoint) => {
                // Arrange
                const geopoint = $geopoint.get(0);
                const state = geopoint._state;

                // Assert
                expect(state["lat"]).to.equal(3.7);
            });
        });
    });
});
