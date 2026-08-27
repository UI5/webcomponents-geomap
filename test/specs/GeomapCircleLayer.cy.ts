import { html } from "lit";
import "../../src/Geomap.js";
import GeomapCircleLayer from "../../src/GeomapCircleLayer.js";
import { Map, setWorkerUrl } from "../../src/MapLibre.js";

describe("ui5-geomap-circle-layer", () => {
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
        it("tests radius property", () => {
            cy.mount(html`<ui5-geomap-circle-layer source="objects" radius="30"></ui5-geomap-circle-layer>`).as("geomapcirclelayer");

            cy.get("@geomapcirclelayer").then(($circleLayer) => {
                // Arrange
                const circleLayer = $circleLayer.get(0);
                const paintProperties = circleLayer.paintProperties;

                // Assert
                expect(paintProperties["circle-radius"]).to.equal(30);

                // Act
                cy.log("Change radius to 40");
                circleLayer.setAttribute("radius", 40);
            });

            cy.get("@geomapcirclelayer").then(($circleLayer) => {
                // Arrange
                const circleLayer = $circleLayer.get(0);
                const paintProperties = circleLayer.paintProperties;

                // Assert
                expect(paintProperties["circle-radius"]).to.equal(40);
            });
        });

        it("tests fill-color property", () => {
            cy.mount(html`<ui5-geomap-circle-layer source="objects" fill-color="green"></ui5-geomap-circle-layer>`).as("geomapcirclelayer");

            cy.get("@geomapcirclelayer").then(($circleLayer) => {
                // Arrange
                const circleLayer = $circleLayer.get(0);
                const paintProperties = circleLayer.paintProperties;

                // Assert
                expect(paintProperties["circle-color"]).to.equal("green");

                // Act
                cy.log("Change fill-color to 'red'");
                circleLayer.setAttribute("fill-color", "red");
            });

            cy.get("@geomapcirclelayer").then(($circleLayer) => {
                // Arrange
                const circleLayer = $circleLayer.get(0);
                const paintProperties = circleLayer.paintProperties;

                // Assert
                expect(paintProperties["circle-color"]).to.equal("red");
            });
        });

        it("tests outline-color property", () => {
            cy.mount(html`<ui5-geomap-circle-layer source="objects" outline-color="green"></ui5-geomap-circle-layer>`).as("geomapcirclelayer");

            cy.get("@geomapcirclelayer").then(($circleLayer) => {
                // Arrange
                const circleLayer = $circleLayer.get(0);
                const paintProperties = circleLayer.paintProperties;

                // Assert
                expect(paintProperties["circle-stroke-color"]).to.equal("green");

                // Act
                cy.log("Change outline-color to 'red'");
                circleLayer.setAttribute("outline-color", "red");
            });

            cy.get("@geomapcirclelayer").then(($circleLayer) => {
                // Arrange
                const circleLayer = $circleLayer.get(0);
                const paintProperties = circleLayer.paintProperties;

                // Assert
                expect(paintProperties["circle-stroke-color"]).to.equal("red");
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-circle-layer source="objects" opacity="0.5"></ui5-geomap-circle-layer>`).as("geomapcirclelayer");

            cy.get("@geomapcirclelayer").then(($circleLayer) => {
                // Arrange
                const circleLayer = $circleLayer.get(0);
                const paintProperties = circleLayer.paintProperties;

                // Assert
                expect(paintProperties["circle-opacity"]).to.equal(0.5);

                // Act
                cy.log("Change opacity to '0.2'");
                circleLayer.setAttribute("opacity", 0.2);
            });

            cy.get("@geomapcirclelayer").then(($circleLayer) => {
                // Arrange
                const circleLayer = $circleLayer.get(0);
                const paintProperties = circleLayer.paintProperties;

                // Assert
                expect(paintProperties["circle-opacity"]).to.equal(0.2);
            });
        });
    });

	describe("test methods", () => {
		it("tests handleInvalidation method", () => {

				// Arrange
				const circleLayer = new GeomapCircleLayer();
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
				expect(circleLayer.fillColor).to.equal("black");

				// Act
				cy.log("Change fill-color to 'blue'");
				circleLayer.setAttribute("fill-color", 'blue');

				// Act
				circleLayer.handleInvalidation({type: "property", name: "fillColor"});

				// Assert
				expect(circleLayer.map.setPaintProperty.calledOnce).to.equal(true);
		});
	});
})
