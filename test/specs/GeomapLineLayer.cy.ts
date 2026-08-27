import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapLineLayer.js";

describe("ui5-geomap-line-layer", () => {
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
            cy.mount(html`<ui5-geomap-line-layer color="green"></ui5-geomap-line-layer>`).as("geomaplinelayer");

            cy.get("@geomaplinelayer").then(($lineLayer) => {
                // Arrange
                const lineLayer = $lineLayer.get(0);
                const paintProperties = lineLayer.paintProperties;

                // Assert
                expect(paintProperties["line-color"]).to.equal("green");

                // Act
                cy.log("Change color to 'red'");
                lineLayer.setAttribute("color", "red");
            });

            cy.get("@geomaplinelayer").then(($lineLayer) => {
                // Arrange
                const lineLayer = $lineLayer.get(0);
                const paintProperties = lineLayer.paintProperties;

                // Assert
                expect(paintProperties["line-color"]).to.equal("red");
            });
        });

        it("tests width property", () => {
            cy.mount(html`<ui5-geomap-line-layer width="2"></ui5-geomap-line-layer>`).as("geomaplinelayer");

            cy.get("@geomaplinelayer").then(($lineLayer) => {
                // Arrange
                const lineLayer = $lineLayer.get(0);
                const paintProperties = lineLayer.paintProperties;

                // Assert
                expect(paintProperties["line-width"]).to.equal(2);

                // Act
                cy.log("Change width to '3'");
                lineLayer.setAttribute("width", 3);
            });

            cy.get("@geomaplinelayer").then(($lineLayer) => {
                // Arrange
                const lineLayer = $lineLayer.get(0);
                const paintProperties = lineLayer.paintProperties;

                // Assert
                expect(paintProperties["line-width"]).to.equal(3);
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-line-layer opacity=0.5"></ui5-geomap-line-layer>`).as("geomaplinelayer");

            cy.get("@geomaplinelayer").then(($lineLayer) => {
                // Arrange
                const lineLayer = $lineLayer.get(0);
                const paintProperties = lineLayer.paintProperties;

                // Assert
                expect(paintProperties["line-opacity"]).to.equal(0.5);

                // Act
                cy.log("Change opacity to '0.3'");
                lineLayer.setAttribute("opacity", 0.3);
            });

            cy.get("@geomaplinelayer").then(($lineLayer) => {
                // Arrange
                const lineLayer = $lineLayer.get(0);
                const paintProperties = lineLayer.paintProperties;

                // Assert
                expect(paintProperties["line-opacity"]).to.equal(0.3);
            });
        });
    });
    describe("test methods", () => {
        it("tests layerType", () => {
            cy.mount(html`<ui5-geomap-line-layer></ui5-geomap-line-layer>`).as("geomaplinelayer");

            cy.get("@geomaplinelayer").then(($linelayer) => {
                // Arrange
                const linelayer = $linelayer.get(0);

                // Act
                const result= linelayer.layerType;

                // Assert
                expect(result).to.equal("line");

            });

        });
    });
});