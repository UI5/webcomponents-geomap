import { html } from "lit";
import { TerraDraw, TerraDrawSelectMode } from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";
import { Map, setWorkerUrl } from "../../src/MapLibre.js";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapRasterTiles.js";

describe("ui5-geomap-raster-tiles", () => {
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
        it("tests url property", () => {
            cy.mount(html`<ui5-geomap-raster-tiles url="www.myUrl.com"></ui5-geomap-raster-tiles>`).as("geomaprastertiles");


            cy.get("@geomaprastertiles").then(($georastertiles) => {
                // Arrange
                const georastertiles = $georastertiles.get(0);
                const state = georastertiles._state;

                // Assert
                expect(state["url"]).to.equal("www.myUrl.com");

                // Act
                cy.log("Change url to yourUrl");
                georastertiles.setAttribute("url", "yourUrl");
            });

            cy.get("@geomaprastertiles").then(($georastertiles) => {
                // Arrange
                const georastertiles = $georastertiles.get(0);
                const state = georastertiles._state;

                // Assert
                expect(state["url"]).to.equal("yourUrl");
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-raster-tiles opacity="0.6"></ui5-geomap-raster-tiles>`).as("geomaprastertiles");


            cy.get("@geomaprastertiles").then(($georastertiles) => {
                // Arrange
                const georastertiles = $georastertiles.get(0);
                const state = georastertiles._state;

                // Assert
                expect(state["opacity"]).to.equal(0.6);

                // Act
                cy.log("Change opacity to 0.7");
                georastertiles.setAttribute("opacity", 0.7);
            });

            cy.get("@geomaprastertiles").then(($georastertiles) => {
                // Arrange
                const georastertiles = $georastertiles.get(0);
                const state = georastertiles._state;

                // Assert
                expect(state["opacity"]).to.equal(0.7);
            });
        });
    });

    describe("text methods", () => {
        it("tests layerType method", () => {
            cy.mount(`<ui5-geomap-raster-tiles></ui5-geomap-raster-tiles>`).as("geomaprastertiles");
            cy.get("@geomaprastertiles").then(($georastertiles) => {
                // Arrange
                const georastertiles = $georastertiles.get(0);

                // Act
                const layerType = georastertiles.layerType;

                // Assert
                expect(layerType).to.equal("raster");

            });

        });

		it("tests layerSource", () => {
			cy.mount(`<ui5-geomap-raster-tiles></ui5-geomap-raster-tiles>`).as("geomaprastertiles");
			cy.get("@geomaprastertiles").then(($georastertiles) => {
				// Arrange
				const georastertiles = $georastertiles.get(0);

				// Act
				let layerType = georastertiles.layerSource;

				// Assert
				expect(layerType).to.equal("ui5wc_1");

				// Arrange
				let cAddSourceCallCount = 0;
				georastertiles.map = {
					getSource: () => undefined,
					addSource: () => {
						cAddSourceCallCount++;
					},
					removeLayer: () => undefined,
				};

				// Act
				layerType = georastertiles.layerSource;

				// Assert
				expect(cAddSourceCallCount).to.equal(1);

			});

		});

		it("tests updateSource", () => {
			cy.mount(`<ui5-geomap-raster-tiles></ui5-geomap-raster-tiles>`).as("geomaprastertiles");
			cy.get("@geomaprastertiles").then(($georastertiles) => {
				// Arrange
				const georastertiles = $georastertiles.get(0);

				// Act
				let layerType = georastertiles.layerSource;

				// Assert
				expect(layerType).to.equal("ui5wc_2");

				const r = georastertiles.updateSource();

				// Assert
				expect(r).to.equal(undefined);

			});

		});

		it("tests onAfterRendering", () => {
			cy.mount(`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-raster-tiles></ui5-geomap-raster-tiles>
			</ui5-geomap>`).as("geomap");
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geomap = $geomap.get(0);
				const georastertiles = geomap.items[0];
				georastertiles.whenMapConnected = () => {
					return new Promise((resolve) => {
						resolve("done");
					});
				};
				let cGetLayerCalled = 0;
				const sp = cy.spy(georastertiles, "updateSource");

				// Act
				const r = georastertiles.onAfterRendering().then((res) => {

					expect(res).to.equal(undefined);

					georastertiles.map = {
						getLayer: () => {
							cGetLayerCalled++;
							return {};
						}
					}

					georastertiles.onAfterRendering().then((res) => {
						expect(cGetLayerCalled).to.equal(1);
						expect(sp.callCount).to.equal(1);
					});
				});

			});

		});

		it("tests connectToDraw assigns the draw instance", () => {
			cy.mount(`<ui5-geomap-raster-tiles></ui5-geomap-raster-tiles>`).as("geomaprastertiles");
			cy.get("@geomaprastertiles").then(($georastertiles) => {
				// Arrange
				const georastertiles = $georastertiles.get(0);
				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5,
				});
				const adapter = new TerraDrawMapLibreGLAdapter({ map });
				const draw = new TerraDraw({
					adapter,
					modes: [new TerraDrawSelectMode()],
				});

				// Sanity-check the precondition
				expect(georastertiles.draw).to.equal(undefined);

				// Act
				georastertiles.connectToDraw(draw);

				// Assert
				expect(georastertiles.draw).to.equal(draw);
			});
		});

		it("tests connectToDraw early-returns when already connected", () => {
			cy.mount(`<ui5-geomap-raster-tiles></ui5-geomap-raster-tiles>`).as("geomaprastertiles");
			cy.get("@geomaprastertiles").then(($georastertiles) => {
				// Arrange
				const georastertiles = $georastertiles.get(0);
				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5,
				});
				const adapter = new TerraDrawMapLibreGLAdapter({ map });
				const firstDraw = new TerraDraw({
					adapter,
					modes: [new TerraDrawSelectMode()],
				});
				const secondDraw = new TerraDraw({
					adapter: new TerraDrawMapLibreGLAdapter({ map }),
					modes: [new TerraDrawSelectMode()],
				});

				// Act - connect first, then try to swap
				georastertiles.connectToDraw(firstDraw);
				georastertiles.connectToDraw(secondDraw);

				// Assert - first one wins, second call short-circuits
				expect(georastertiles.draw).to.equal(firstDraw);
			});
		});
    });
});
