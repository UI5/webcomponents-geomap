import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapLine.js";
import "../../src/GeomapPoint.js";

describe("ui5-geomap-line", () => {
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
            cy.mount(html`<ui5-geomap-line color="green"></ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const paintProperties = line.paintProperties;

                // Assert
                expect(paintProperties["line-color"]).to.equal("green");

                // Act
                cy.log("Change color to 'red'");
                line.setAttribute("color", "red");
            });

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const paintProperties = line.paintProperties;

                // Assert
                expect(paintProperties["line-color"]).to.equal("red");
            });
        });

        it("tests width property", () => {
            cy.mount(html`<ui5-geomap-line width="2"></ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const paintProperties = line.paintProperties;

                // Assert
                expect(paintProperties["line-width"]).to.equal(2);

                // Act
                cy.log("Change width to '3'");
                line.setAttribute("width", 3);
            });

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const paintProperties = line.paintProperties;

                // Assert
                expect(paintProperties["line-width"]).to.equal(3);
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-line opacity="0.5"></ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const paintProperties = line.paintProperties;

                // Assert
                expect(paintProperties["line-opacity"]).to.equal(0.5);

                // Act
                cy.log("Change opacity to '0.2'");
                line.setAttribute("opacity", 0.2);
            });

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const paintProperties = line.paintProperties;

                // Assert
                expect(paintProperties["line-opacity"]).to.equal(0.2);
            });
        });
    });

    describe("test methods", () => {
        it("tests sourceData", () => {
            cy.mount(html`<ui5-geomap-line>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const geometry = line.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

                // Assert
                expect(type).to.equal("LineString");
                expect(coordinates[0]).to.deep.equal([6.1757, 49.1193]);
                expect(coordinates[1]).to.deep.equal([6.1844, 48.6921]);
                expect(coordinates[2]).to.deep.equal([7.7521, 48.5734]);

                // Act
                cy.log("Change lng of point1 to 5");
                cy.log("Change lat of point1 to 50");
                line.children[0].setAttribute("lng", 5);
                line.children[0].setAttribute("lat", 50);

                cy.log("Change lng of point2 to 8");
                cy.log("Change lat of point2 to 40");
                line.children[1].setAttribute("lng", 8);
                line.children[1].setAttribute("lat", 40);

                cy.log("Change lng of point3 to 9");
                cy.log("Change lat of point3 to 30");
                line.children[2].setAttribute("lng", 9);
                line.children[2].setAttribute("lat", 30);
            });

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const geometry = line.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

                // Assert
                expect(type).to.equal("LineString");
                expect(coordinates[0]).to.deep.equal([5, 50]);
                expect(coordinates[1]).to.deep.equal([8, 40]);
                expect(coordinates[2]).to.deep.equal([9, 30]);
            });
        });

		it("tests sourceData - corners", () => {
            cy.mount(html`<ui5-geomap-line>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
            </ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const geometry = line.sourceData.geometry;
                const coordinates = geometry.coordinates;
                const type = geometry.type;

				// Assert
				expect(type).to.equal("LineString");
				expect(coordinates.length).to.equal(0);
            });
        });

        it("tests pointsArr", () => {
            cy.mount(html`<ui5-geomap-line>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const pointsArr = line.pointsArr

                // Assert
                expect(pointsArr[0]).to.deep.equal([6.1757, 49.1193]);
                expect(pointsArr[1]).to.deep.equal([6.1844, 48.6921]);
                expect(pointsArr[2]).to.deep.equal([7.7521, 48.5734]);

                // Act
                cy.log("Change lng of point1 to 5");
                cy.log("Change lat of point1 to 50");
                line.children[0].setAttribute("lng", 5);
                line.children[0].setAttribute("lat", 50);

                cy.log("Change lng of point2 to 8");
                cy.log("Change lat of point2 to 40");
                line.children[1].setAttribute("lng", 8);
                line.children[1].setAttribute("lat", 40);

                cy.log("Change lng of point3 to 9");
                cy.log("Change lat of point3 to 30");
                line.children[2].setAttribute("lng", 9);
                line.children[2].setAttribute("lat", 30);
            });

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const pointsArr = line.pointsArr

                // Assert
                expect(pointsArr[0]).to.deep.equal([5, 50]);
                expect(pointsArr[1]).to.deep.equal([8, 40]);
                expect(pointsArr[2]).to.deep.equal([9, 30]);
            });
        });

        it("tests getDistance", () => {
            cy.mount(html`<ui5-geomap-line>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const distance = line.getDistance();

                // Assert
                expect(distance).to.equal(163.46377389957507);

                // Act
                cy.log("Change lng of point1 to 5");
                cy.log("Change lat of point1 to 50");
                line.children[0].setAttribute("lng", 5);
                line.children[0].setAttribute("lat", 50);

                cy.log("Change lng of point2 to 8");
                cy.log("Change lat of point2 to 40");
                line.children[1].setAttribute("lng", 8);
                line.children[1].setAttribute("lat", 40);

                cy.log("Change lng of point3 to 9");
                cy.log("Change lat of point3 to 30");
                line.children[2].setAttribute("lng", 9);
                line.children[2].setAttribute("lat", 30);
            });

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const distance = line.getDistance();

                // Assert
                expect(distance).to.equal(2252.09438209135);
            });
        });

        it("tests layoutProperties", () => {
            cy.mount(html`<ui5-geomap-line>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const layoutProperties = line.layoutProperties;
				expect(layoutProperties).to.deep.equal({"visibility": "visible", "line-join": "round"});
            });
        });

        it("tests layerType", () => {
            cy.mount(html`<ui5-geomap-line>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const layerType = line.layerType;
				expect(layerType).to.equal("line");
            });
        });

        it("tests sourceUpdateNeeded", () => {
            cy.mount(html`<ui5-geomap-line>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                let r = line.sourceUpdateNeeded({ type: "property" });
				expect(r).to.be.false;
				r = line.sourceUpdateNeeded({ type: "slot" });
				expect(r).to.be.true;
            });
        });

        it("tests getPointAt", () => {
            cy.mount(html`<ui5-geomap-line>
                <ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
                <ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
                <ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
            </ui5-geomap-line>`).as("geomapline");

            cy.get("@geomapline").then(($line) => {
                // Arrange
                const line = $line.get(0);
                const distance = line.getPointAt(200, "kilometers");

                // Assert
                expect(distance).to.deep.equal({ lng: 7.7521, lat: 48.5734 });
            });
        });


		it("tests handleAddDraggable", () => {
			cy.mount(html`<ui5-geomap-line>
				<ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
				<ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
				<ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
			</ui5-geomap-line dragndrop>`).as("geomapline");

			cy.get("@geomapline").then(($geomapline) => {
				// Arrange
				const geoline = $geomapline.get(0);
				let c = 0;
				geoline.addDrawer = function() {
					c++;
				};

				// Assert
				expect(geoline._internalState).to.deep.equal({dragging: false, id: null});

				// Act
				geoline.handleAddDraggable();


				// Assert
				expect(geoline._internalState).to.not.deep.equal({dragging: false, id: null});
				expect(c).to.equal(1);
			});
		});

		it("tests removeDrawer", () => {
			cy.mount(html`<ui5-geomap-line>
				<ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
				<ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
				<ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
			</ui5-geomap-line dragndrop>`).as("geomapline");

			cy.get("@geomapline").then(($geomapline) => {
				// Arrange
				const geoline = $geomapline.get(0);
				let c = 0;
				geoline.draw = {
					removeFeatures: function() {
						c++;
					},
					off: function (event, callback) {

					}
				}

				// Assert
				expect(geoline._internalState).to.deep.equal({dragging: false, id: null});

				// Act
				let r = geoline.removeDrawer();

				// Assert
				expect(r).to.equal(undefined);

				// Arrange
				geoline._internalState.id = "testId";

				// Act
				r = geoline.removeDrawer();

				// Assert
				expect(geoline._internalState.dragging).to.equal(false);
				expect(c).to.equal(1);
			});
		});

		it("tests finishDraggable", () => {
			cy.mount(html`<ui5-geomap-line>
				<ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
				<ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
				<ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
			</ui5-geomap-line dragndrop>`).as("geomapline");

			cy.get("@geomapline").then(($geomapline) => {
				// Arrange
				const geomapline = $geomapline.get(0);

				let c = 0;
				geomapline.draw = {
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
				expect(geomapline._internalState).to.deep.equal({dragging: false, id: null});

				// Arrange
				geomapline._internalState.id = "testId";
				const e = "testId";

				// Act
				let r = geomapline.finishDraggable();

				expect(r).to.equal(undefined);

				r = geomapline.finishDraggable(e);

				// Arrange
				geomapline.draw.getSnapshot = function() {
					return [];
				}

				r = geomapline.finishDraggable(e);
				expect(r).to.equal(undefined);
			});
		});

		it("tests addDrawer", () => {
			cy.mount(html`<ui5-geomap-line>
				<ui5-geomap-point lng="6.1757" lat="49.1193"></ui5-geomap-point>
				<ui5-geomap-point lng="6.1844" lat="48.6921"></ui5-geomap-point>
				<ui5-geomap-point lng="7.7521" lat="48.5734"></ui5-geomap-point>
			</ui5-geomap-line dragndrop>`).as("geomapline");

			cy.get("@geomapline").then(($geomapline) => {
				// Arrange
				const geomapline = $geomapline.get(0);
				let cFID = 0;
				let cS = 0;
				let cSM = 0;
				let cAF = 0;
				let cMS = 0;
				geomapline.draw = {
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
				expect(geomapline._internalState).to.deep.equal({dragging: false, id: null});

				// Arrange
				geomapline._internalState.id = "testId";
				const e = "testId";

				// Act
				let r = geomapline.addDrawer();

				expect(r).to.equal(undefined);
				expect(cFID).to.equal(1);
				expect(cS).to.equal(1);
				expect(cSM).to.equal(2);
				expect(cAF).to.equal(1);
				expect(cMS).to.equal(1);
			});
		});
    });
});
