import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapFillLayer.js";

describe("ui5-geomap-fill-layer", () => {
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
        it("tests fill-color property", () => {
            cy.mount(html`<ui5-geomap-fill-layer fill-color="green">

            </ui5-geomap-fill-layer>`).as("geomapfilllayer");

            cy.get("@geomapfilllayer").then(($fillLayer) => {
                // Arrange
                const fillLayer = $fillLayer.get(0);
                const paintProperties = fillLayer.paintProperties;

                // Assert
                expect(paintProperties["fill-color"]).to.equal("green");

                // Act
                cy.log("Change fill-color to 'red'");
                fillLayer.setAttribute("fill-color", "red");
            });

            cy.get("@geomapfilllayer").then(($fillLayer) => {
                // Arrange
                const fillLayer = $fillLayer.get(0);
                const paintProperties = fillLayer.paintProperties;

                // Assert
                expect(paintProperties["fill-color"]).to.equal("red");
            });
        });

        it("tests outline-color property", () => {
            cy.mount(html`<ui5-geomap-fill-layer outline-color="green">

            </ui5-geomap-fill-layer>`).as("geomapfilllayer");

            cy.get("@geomapfilllayer").then(($fillLayer) => {
                // Arrange
                const fillLayer = $fillLayer.get(0);
                const paintProperties = fillLayer.paintProperties;

                // Assert
                expect(paintProperties["fill-outline-color"]).to.equal("green");

                // Act
                cy.log("Change outline-color to 'red'");
                fillLayer.setAttribute("outline-color", "red");
            });

            cy.get("@geomapfilllayer").then(($fillLayer) => {
                // Arrange
                const fillLayer = $fillLayer.get(0);
                const paintProperties = fillLayer.paintProperties;

                // Assert
                expect(paintProperties["fill-outline-color"]).to.equal("red");
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-fill-layer opacity="0.5">

            </ui5-geomap-fill-layer>`).as("geomapfilllayer");

            cy.get("@geomapfilllayer").then(($fillLayer) => {
                // Arrange
                const fillLayer = $fillLayer.get(0);
                const paintProperties = fillLayer.paintProperties;

                // Assert
                expect(paintProperties["fill-opacity"]).to.equal(0.5);

                // Act
                cy.log("Change opacity to '0.2'");
                fillLayer.setAttribute("opacity", 0.2);
            });

            cy.get("@geomapfilllayer").then(($fillLayer) => {
                // Arrange
                const fillLayer = $fillLayer.get(0);
                const paintProperties = fillLayer.paintProperties;

                // Assert
                expect(paintProperties["fill-opacity"]).to.equal(0.2);
            });
        });
    });

	describe("test methods", () => {
		it("tests layerType", () => {
			cy.mount(html`
				<ui5-geomap-fill-layer fill-color="green">

				</ui5-geomap-fill-layer>`).as("geomapfilllayer");

			cy.get("@geomapfilllayer").then(($fillLayer) => {
				// Arrange
				const fillLayer = $fillLayer.get(0);
				const layerType = fillLayer.layerType;

				// Assert
				expect(layerType).to.equal("fill");
			});
		});
	});
})
