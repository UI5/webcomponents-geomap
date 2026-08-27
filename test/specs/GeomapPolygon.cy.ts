import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapPolygon.js";
import "../../src/GeomapPoint.js";

describe("ui5-geomap-polygon", () => {
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
            cy.mount(html`<ui5-geomap-polygon fill-color="green"></ui5-geomap-polygon>`).as("geomappolygon");

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const paintProperties = polygon.paintProperties;

                // Assert
                expect(paintProperties["fill-color"]).to.equal("green");

                // Act
                cy.log("Change fill-color to 'red'");
                polygon.setAttribute("fill-color", "red");
            });

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const paintProperties = polygon.paintProperties;

                // Assert
                expect(paintProperties["fill-color"]).to.equal("red");
            });
        });

        it("tests outline-color property", () => {
            cy.mount(html`<ui5-geomap-polygon outline-color="green"></ui5-geomap-polygon>`).as("geomappolygon");

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const paintProperties = polygon.paintProperties;

                // Assert
                expect(paintProperties["fill-outline-color"]).to.equal("green");

                // Act
                cy.log("Change outline-color to 'red'");
                polygon.setAttribute("outline-color", "red");
            });

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const paintProperties = polygon.paintProperties;

                // Assert
                expect(paintProperties["fill-outline-color"]).to.equal("red");
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-polygon opacity="0.5"></ui5-geomap-polygon>`).as("geomappolygon");

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const paintProperties = polygon.paintProperties;

                // Assert
                expect(paintProperties["fill-opacity"]).to.equal(0.5);

                // Act
                cy.log("Change opacity to '0.2'");
                polygon.setAttribute("opacity", 0.2);
            });

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const paintProperties = polygon.paintProperties;

                // Assert
                expect(paintProperties["fill-opacity"]).to.equal(0.2);
            });
        });
    });

    describe("test methods", () => {
        it("tests sourceData", () => {
            cy.mount(html`<ui5-geomap-polygon>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-polygon>`).as("geomappolygon");

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const geometry = polygon.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

                // Assert
                expect(type).to.equal("Polygon");
                expect(coordinates[0][0]).to.deep.equal([6.1757, 49.1193]);
                expect(coordinates[0][1]).to.deep.equal([6.1844, 48.6921]);
                expect(coordinates[0][2]).to.deep.equal([7.7521, 48.5734]);
                expect(coordinates[0][3]).to.deep.equal([6.1757, 49.1193]);

				expect(polygon.layerSource).to.equal('ui5wc_1');

				let bUpdateNeeded = polygon.sourceUpdateNeeded({});
				expect(bUpdateNeeded).to.be.false;

				bUpdateNeeded = polygon.sourceUpdateNeeded({type: "slot"});
				expect(bUpdateNeeded).to.be.true;

                // Act
                cy.log("Change lng of point1 to 5");
                cy.log("Change lat of point1 to 50");
                polygon.children[0].setAttribute("lng", 5);
                polygon.children[0].setAttribute("lat", 50);

                cy.log("Change lng of point2 to 8");
                cy.log("Change lat of point2 to 40");
                polygon.children[1].setAttribute("lng", 8);
                polygon.children[1].setAttribute("lat", 40);

                cy.log("Change lng of point3 to 9");
                cy.log("Change lat of point3 to 30");
                polygon.children[2].setAttribute("lng", 9);
                polygon.children[2].setAttribute("lat", 30);

            });

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const geometry = polygon.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

                // Assert
                expect(type).to.equal("Polygon");
                expect(coordinates[0][0]).to.deep.equal([5, 50]);
                expect(coordinates[0][1]).to.deep.equal([8, 40]);
                expect(coordinates[0][2]).to.deep.equal([9, 30]);
                expect(coordinates[0][3]).to.deep.equal([5, 50]);
            });
        });

        it("tests pointsArr", () => {
            cy.mount(html`<ui5-geomap-polygon>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-polygon>`).as("geomappolygon");

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const pointsArr = polygon.pointsArr

                // Assert
                expect(pointsArr[0]).to.deep.equal([6.1757, 49.1193]);
                expect(pointsArr[1]).to.deep.equal([6.1844, 48.6921]);
                expect(pointsArr[2]).to.deep.equal([7.7521, 48.5734]);
                expect(pointsArr[3]).to.deep.equal([6.1757, 49.1193]);

                // Act
                cy.log("Change lng of point1 to 5");
                cy.log("Change lat of point1 to 50");
                polygon.children[0].setAttribute("lng", 5);
                polygon.children[0].setAttribute("lat", 50);

                cy.log("Change lng of point2 to 8");
                cy.log("Change lat of point2 to 40");
                polygon.children[1].setAttribute("lng", 8);
                polygon.children[1].setAttribute("lat", 40);

                cy.log("Change lng of point3 to 9");
                cy.log("Change lat of point3 to 30");
                polygon.children[2].setAttribute("lng", 9);
                polygon.children[2].setAttribute("lat", 30);
            });

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);
                const pointsArr = polygon.pointsArr

                // Assert
                expect(pointsArr[0]).to.deep.equal([5, 50]);
                expect(pointsArr[1]).to.deep.equal([8, 40]);
                expect(pointsArr[2]).to.deep.equal([9, 30]);
                expect(pointsArr[3]).to.deep.equal([5, 50]);
            });
        });
        it("tests layerType", () => {
            cy.mount(html`<ui5-geomap-polygon></ui5-geomap-polygon>`).as("geomappolygon");

            cy.get("@geomappolygon").then(($polygon) => {
                // Arrange
                const polygon = $polygon.get(0);

                // Act
                const result= polygon.layerType;

                // Assert
                expect(result).to.equal("fill");

            });

        });


		it("tests handleAddDraggable", () => {
			cy.mount(html`<ui5-geomap-polygon>
				<ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
				<ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
				<ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
			</ui5-geomap-polygon dragndrop>`).as("geomappolygon");

			cy.get("@geomappolygon").then(($geomappolygon) => {
				// Arrange
				const geomappolygon = $geomappolygon.get(0);
				let c = 0;
				geomappolygon.addDrawer = function() {
					c++;
				};

				// Assert
				expect(geomappolygon._internalState).to.deep.equal({dragging: false, id: null});

				// Act
				geomappolygon.handleAddDraggable();


				// Assert
				expect(geomappolygon._internalState).to.not.deep.equal({dragging: false, id: null});
				expect(c).to.equal(1);
			});
		});

		it("tests removeDrawer", () => {
			cy.mount(html`<ui5-geomap-polygon>
				<ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
				<ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
				<ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
			</ui5-geomap-polygon dragndrop>`).as("geomappolygon");

			cy.get("@geomappolygon").then(($geomappolygon) => {
				// Arrange
				const geomappolygon = $geomappolygon.get(0);
				let c = 0;
				geomappolygon.draw = {
					removeFeatures: function() {
						c++;
					},
					off: function (event, callback) {

					}
				}

				// Assert
				expect(geomappolygon._internalState).to.deep.equal({dragging: false, id: null});

				// Act
				let r = geomappolygon.removeDrawer();

				// Assert
				expect(r).to.equal(undefined);

				// Arrange
				geomappolygon._internalState.id = "testId";

				// Act
				r = geomappolygon.removeDrawer();

				// Assert
				expect(geomappolygon._internalState.dragging).to.equal(false);
				expect(c).to.equal(1);
			});
		});

		it("tests finishDraggable", () => {
			cy.mount(html`<ui5-geomap-polygon>
				<ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
				<ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
				<ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
			</ui5-geomap-polygon dragndrop>`).as("geomappolygon");

			cy.get("@geomappolygon").then(($geomappolygon) => {
				// Arrange
				const geomappolygon = $geomappolygon.get(0);
				let c = 0;
				geomappolygon.draw = {
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
									coordinates: [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]]
								}
							}
						];
					},
					on: function (event, callback) {

					}
				}

				// Assert
				expect(geomappolygon._internalState).to.deep.equal({dragging: false, id: null});

				// Arrange
				geomappolygon._internalState.id = "testId";
				const e = "testId";

				// Act
				let r = geomappolygon.finishDraggable();

				expect(r).to.equal(undefined);

				r = geomappolygon.finishDraggable(e);

				// Arrange
				geomappolygon.draw.getSnapshot = function() {
					return [];
				}

				r = geomappolygon.finishDraggable(e);
				expect(r).to.equal(undefined);
			});
		});

		it("tests addDrawer", () => {
			cy.mount(html`<ui5-geomap-polygon>
				<ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
				<ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
				<ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
			</ui5-geomap-polygon dragndrop>`).as("geomappolygon");

			cy.get("@geomappolygon").then(($geomappolygon) => {
				// Arrange
				const geomappolygon = $geomappolygon.get(0);
				let cFID = 0;
				let cS = 0;
				let cSM = 0;
				let cAF = 0;
				geomappolygon.draw = {
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
					on: function (event, callback) {

					}
				}

				// Assert
				expect(geomappolygon._internalState).to.deep.equal({dragging: false, id: null});

				// Arrange
				geomappolygon._internalState.id = "testId";
				const e = "testId";

				// Act
				let r = geomappolygon.addDrawer();

				expect(r).to.equal(undefined);
				expect(cFID).to.equal(1);
				expect(cS).to.equal(1);
				expect(cSM).to.equal(2);
				expect(cAF).to.equal(1);
			});
		});
    });
});
