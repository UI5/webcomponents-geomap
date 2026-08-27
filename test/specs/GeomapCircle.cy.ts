import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapCircle.js";
import GeomapGeometry from "../../src/geometry/GeomapGeometry";
import GeomapGeometryUtil from "../../src/geometry/GeomapGeometryUtil";

describe("ui5-geomap-circle", () => {
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
            cy.mount(html`<ui5-geomap-circle lng="30"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const state = geocircle._state;

                // Assert
                expect(state["lng"]).to.equal(30);

                // Act
                cy.log("Change lng to 40");
                geocircle.setAttribute("lng", 40);
            });

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const state = geocircle._state;

                // Assert
                expect(state["lng"]).to.equal(40);
            });
        });

        it("tests lat property", () => {
            cy.mount(html`<ui5-geomap-circle lat="30"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const state = geocircle._state;

                // Assert
                expect(state["lat"]).to.equal(30);

                // Act
                cy.log("Change lat to 40");
                geocircle.setAttribute("lat", 40);
            });

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const state = geocircle._state;

                // Assert
                expect(state["lat"]).to.equal(40);
            });
        });

        it("tests radius property", () => {
            cy.mount(html`<ui5-geomap-circle radius="30"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-radius"]).to.equal(30);

                // Act
                cy.log("Change radius to 40");
                geocircle.setAttribute("radius", 40);
            });

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-radius"]).to.equal(40);
            });
        });

        it("tests fill-color property", () => {
            cy.mount(html`<ui5-geomap-circle fill-color="green"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-color"]).to.equal("green");

                // Act
                cy.log("Change fill-color to 'red'");
                geocircle.setAttribute("fill-color", "red");
            });

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-color"]).to.equal("red");
            });
        });

        it("tests outline-color property", () => {
            cy.mount(html`<ui5-geomap-circle outline-color="green"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-stroke-color"]).to.equal("green");

                // Act
                cy.log("Change outline-color to 'red'");
                geocircle.setAttribute("outline-color", "red");
            });

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-stroke-color"]).to.equal("red");
            });
        });

        it("tests outline-width property", () => {
            cy.mount(html`<ui5-geomap-circle outline-width="1"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-stroke-width"]).to.equal(1);

                // Act
                cy.log("Change outline-width to '2'");
                geocircle.setAttribute("outline-width", 2);
            });

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-stroke-width"]).to.equal(2);
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-circle opacity="0.5"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-opacity"]).to.equal(0.5);

                // Act
                cy.log("Change opacity to '0.2'");
                geocircle.setAttribute("opacity", 0.2);
            });

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const paintProperties = geocircle.paintProperties;

                // Assert
                expect(paintProperties["circle-opacity"]).to.equal(0.2);
            });
        });
    });

    describe("test methods", () => {
        it("tests sourceData", () => {
            cy.mount(html`<ui5-geomap-circle lng="30" lat="6"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const geometry = geocircle.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

                // Assert
                expect(type).to.equal("Point");
                expect(coordinates).to.deep.equal([30, 6]);

                // Act
                cy.log("Change lng to 40");
                cy.log("Change lat to 7");
                geocircle.setAttribute("lng", 40);
                geocircle.setAttribute("lat", 7);
            });

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const geometry = geocircle.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

                // Assert
                expect(type).to.equal("Point");
                expect(coordinates).to.deep.equal([40, 7]);
            });
        });

		it("tests sourceUpdateNeeded", () => {
            cy.mount(html`<ui5-geomap-circle lng="30" lat="6"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const geometry = geocircle.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

                // Assert
                expect(type).to.equal("Point");
                expect(coordinates).to.deep.equal([30, 6]);

				let bUpdateNeeded = geocircle.sourceUpdateNeeded({type: "property"});
				expect(bUpdateNeeded).to.be.false;

				bUpdateNeeded = geocircle.sourceUpdateNeeded({type: "property", name: "lng"});
				expect(bUpdateNeeded).to.be.true;
            });
        });

		it("tests layerType", () => {
            cy.mount(html`<ui5-geomap-circle lng="30" lat="6"></ui5-geomap-circle>`).as("geomapcircle");

            cy.get("@geomapcircle").then(($geocircle) => {
                // Arrange
                const geocircle = $geocircle.get(0);
                const geometry = geocircle.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

                // Assert
				const layerType = geocircle.layerType;
				expect(layerType).to.equal("circle");
            });
        });



		it("tests handleAddDraggable", () => {
			cy.mount(html`<ui5-geomap-circle lng="30" lat="6" dragndrop></ui5-geomap-circle>`).as("geomapcircle");

			cy.get("@geomapcircle").then(($geocircle) => {
				// Arrange
				const geocircle = $geocircle.get(0);
				let c = 0;
				geocircle.addDrawer = function() {
					c++;
				};

				// Assert
				expect(geocircle._internalState).to.deep.equal({dragging: false, id: null});

				// Act
				geocircle.handleAddDraggable();


				// Assert
				expect(geocircle._internalState).to.not.deep.equal({dragging: false, id: null});
				expect(c).to.equal(1);
			});
		});

		it("tests removeDrawer", () => {
			cy.mount(html`<ui5-geomap-circle lng="30" lat="6" dragndrop></ui5-geomap-circle>`).as("geomapcircle");

			cy.get("@geomapcircle").then(($geocircle) => {
				// Arrange
				const geocircle = $geocircle.get(0);
				let c = 0;
				geocircle.draw = {
					removeFeatures: function() {
						c++;
					},
					off: function (event, callback) {

					}
				}

				// Assert
				expect(geocircle._internalState).to.deep.equal({dragging: false, id: null});

				// Act
				let r = geocircle.removeDrawer();

				// Assert
				expect(r).to.equal(undefined);

				// Arrange
				geocircle._internalState.id = "testId";

				// Act
				r = geocircle.removeDrawer();

				// Assert
				expect(geocircle._internalState.dragging).to.equal(false);
				expect(c).to.equal(1);
			});
		});

		it("tests finishDraggable", () => {
			cy.mount(html`<ui5-geomap-circle lng="30" lat="6" dragndrop></ui5-geomap-circle>`).as("geomapcircle");

			cy.get("@geomapcircle").then(($geocircle) => {
				// Arrange
				const geocircle = $geocircle.get(0);
				const gP = cy.spy(GeomapGeometry, "geomapPolygon");
				const gC = cy.spy(GeomapGeometry, "geomapCentroid");
				const gPD = cy.spy(GeomapGeometryUtil, "pointDistance");
				let c = 0;
				geocircle.draw = {
					removeFeatures: function() {
						c++;
					},
					off: function (event, callback) {

					},
					getSnapshot: function() {
						return [
							{
								id: "testId",
								geometry: {
									coordinates: [-5, 20]
								}
							}
						];
					},
					on: function (event, callback) {

					}
				}

				// Assert
				expect(geocircle._internalState).to.deep.equal({dragging: false, id: null});

				// Arrange
				geocircle._internalState.id = "testId";
				const e = "testId";

				// Act
				let r = geocircle.finishDraggable();

				expect(r).to.equal(undefined);

				r = geocircle.finishDraggable(e);

				expect(geocircle.lng).to.equal(-5);
				expect(geocircle.lat).to.equal(20);

				// Arrange
				geocircle.draw.getSnapshot = function() {
					return [];
				}

				r = geocircle.finishDraggable(e);
				expect(r).to.equal(undefined);
			});
		});

		it("tests addDrawer", () => {
			cy.mount(html`<ui5-geomap-circle lng="30" lat="6" dragndrop></ui5-geomap-circle>`).as("geomapcircle");

			cy.get("@geomapcircle").then(($geocircle) => {
				// Arrange
				const geocircle = $geocircle.get(0);
				const gP = cy.spy(GeomapGeometry, "geomapPolygon");
				const gC = cy.spy(GeomapGeometry, "geomapCentroid");
				const gPD = cy.spy(GeomapGeometryUtil, "pointDistance");
				let cFID = 0;
				let cS = 0;
				let cSM = 0;
				let cAF = 0;
				let cMS = 0;
				geocircle.draw = {
					getFeatureId: function() {
						cFID++;
						return "testId";
					},
					start(mode) {
						cS++;
					},
					setMode(mode) {
						cSM++;
					},
					addFeatures: function() {
						cAF++;
					},
					setModeStyles: function() {
						cMS++;
					},
					on: function (event, callback) {

					}
				}

				// Assert
				expect(geocircle._internalState).to.deep.equal({dragging: false, id: null});

				// Arrange
				geocircle._internalState.id = "testId";
				const e = "testId";

				// Act
				let r = geocircle.addDrawer();

				expect(r).to.equal(undefined);
				expect(cFID).to.equal(1);
				expect(cS).to.equal(1);
				expect(cSM).to.equal(2);
				expect(cAF).to.equal(1);
				expect(cMS).to.equal(1);
			});
		});

    });
})
