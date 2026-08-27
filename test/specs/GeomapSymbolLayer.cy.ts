import { html } from "lit";
import "../../src/Geomap.js";
import GeomapSymbolLayer from "../../src/GeomapSymbolLayer.js";
import GeomapCircleLayer from "../../src/GeomapCircleLayer";
import {Map} from "../../src/MapLibre";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("ui5-geomap-symbol-layer", () => {
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
        it("tests text property", () => {
            cy.mount(html`<ui5-geomap-symbol-layer text="value"></ui5-geomap-symbol-layer>`).as("geomapsymbollayer");

            cy.get("@geomapsymbollayer").then(($symbolLayer) => {
                // Arrange
                const symbolLayer = $symbolLayer.get(0);
                const layoutProperties = symbolLayer.layoutProperties;

                // Assert
                expect(layoutProperties["text-field"]).to.equal("value");

                // Act
                cy.log("Change text to 'value 2'");
                symbolLayer.setAttribute("text", "value 2");
            });

            cy.get("@geomapsymbollayer").then(($symbolLayer) => {
                // Arrange
                const symbolLayer = $symbolLayer.get(0);
                const layoutProperties = symbolLayer.layoutProperties;

                // Assert
                expect(layoutProperties["text-field"]).to.equal("value 2");
            });
        });

        it("tests text-size property", () => {
            cy.mount(html`<ui5-geomap-symbol-layer text-size="2"></ui5-geomap-symbol-layer>`).as("geomapsymbollayer");

            cy.get("@geomapsymbollayer").then(($symbolLayer) => {
                // Arrange
                const symbolLayer = $symbolLayer.get(0);
                const layoutProperties = symbolLayer.layoutProperties;

                // Assert
                expect(layoutProperties["text-size"]).to.equal(2);

                // Act
                cy.log("Change text-size to '3'");
                symbolLayer.setAttribute("text-size", 3);
            });

            cy.get("@geomapsymbollayer").then(($symbolLayer) => {
                // Arrange
                const symbolLayer = $symbolLayer.get(0);
                const layoutProperties = symbolLayer.layoutProperties;

                // Assert
                expect(layoutProperties["text-size"]).to.equal(3);
            });
        });

        it("tests text-anchor property", () => {
            cy.mount(html`<ui5-geomap-symbol-layer text-anchor="center"></ui5-geomap-symbol-layer>`).as("geomapsymbollayer");

            cy.get("@geomapsymbollayer").then(($symbolLayer) => {
                // Arrange
                const symbolLayer = $symbolLayer.get(0);
                const layoutProperties = symbolLayer.layoutProperties;

                // Assert
                expect(layoutProperties["text-anchor"]).to.equal("center");

                // Act
                cy.log("Change text-anchor to 'left'");
                symbolLayer.setAttribute("text-anchor", "left");
            });

            cy.get("@geomapsymbollayer").then(($symbolLayer) => {
                // Arrange
                const symbolLayer = $symbolLayer.get(0);
                const layoutProperties = symbolLayer.layoutProperties;

                // Assert
                expect(layoutProperties["text-anchor"]).to.equal("left");
            });
        });

        it("tests text-font property", () => {
            cy.mount(html`<ui5-geomap-symbol-layer text-font="font1"></ui5-geomap-symbol-layer>`).as("geomapsymbollayer");

            cy.get("@geomapsymbollayer").then(($symbolLayer) => {
                // Arrange
                const symbolLayer = $symbolLayer.get(0);
                const layoutProperties = symbolLayer.layoutProperties;

                // Assert
                expect(layoutProperties["text-font"]).to.equal("font1");

                // Act
                cy.log("Change text-font to 'font2'");
                symbolLayer.setAttribute("text-font", "font2");
            });

            cy.get("@geomapsymbollayer").then(($symbolLayer) => {
                // Arrange
                const symbolLayer = $symbolLayer.get(0);
                const layoutProperties = symbolLayer.layoutProperties;

                // Assert
                expect(layoutProperties["text-font"]).to.equal("font2");
            });
        });
    });


	describe("test methods", () => {
		it("tests handleInvalidation method", () => {

			// Arrange
			const circleLayer = new GeomapSymbolLayer();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			circleLayer.map = map;

			cy.stub(map, "getLayer").returns(true);
			cy.stub(circleLayer.map, "setPaintProperty");
			cy.stub(circleLayer.map, "setLayoutProperty");
			cy.stub(circleLayer, "_getPropertyValue");

			// Assert
			expect(circleLayer.textSize).to.equal(0);

			// Act
			cy.log("Change textSize to 1");
			circleLayer.setAttribute("text-size", "1");

			// Act
			circleLayer.handleInvalidation({type: "property", name: "textSize"});

			// Assert
			expect(circleLayer.map.setLayoutProperty.calledOnce).to.equal(true);
		});
	});
});