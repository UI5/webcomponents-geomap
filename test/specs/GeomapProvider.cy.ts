import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";

describe("ui5-geomap-provider", () => {
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
        it("tests styleUrl property", () => {
            cy.mount(html`<ui5-geomap-provider slot="mapControls" style-url="http://testStyleUrl"></ui5-geomap-provider>`).as("geomapProvider");

            cy.get("@geomapProvider").then(($geomapProvider) => {
                // Arrange
                const geomapProvider = $geomapProvider.get(0);
                const state = geomapProvider._state;

                // Assert
                expect(state["styleUrl"]).to.equal("http://testStyleUrl");
            });
        });
    });

    describe("test methods", () => {
        it("tests sourceData", () => {
            cy.mount(html`<ui5-geomap-provider
                slot="mapControls"
				style-url="">
				</ui5-geomap-provider>`).as("geomapProvider");

            cy.get("@geomapProvider").then(($geomapProvider) => {
                // Arrange
                const geomapProvider = $geomapProvider.get(0);
				const isValidConfiguration = geomapProvider.isValidConfiguration();
                // Assert
                expect(isValidConfiguration).to.equal(false);
            });
        });
    });
})
