import { html } from "lit";
import "../../src/GeomapArc.js";
import GeomapGeometry from "../../src/geometry/GeomapGeometry.js";

describe("ui5-geomap-arc", () => {
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
        cy.mount(html`<ui5-geomap-arc></ui5-geomap-arc>`).as("geomaparc");
    });

    describe("test properties", () => {
        it("tests beginLng property", () => {
            cy.mount(html`<ui5-geomap-arc begin-lng="30"></ui5-geomap-arc>`).as("geomaparc");

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["beginLng"]).to.equal(30);

                // Act
                cy.log("Change beginLng to 40");
                geoarc.setAttribute("begin-lng", 40);
            });

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["beginLng"]).to.equal(40);
            });
        });

        it("tests beginLat property", () => {
            cy.mount(html`<ui5-geomap-arc begin-lat="10"></ui5-geomap-arc>`).as("geomaparc");

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["beginLat"]).to.equal(10);

                // Act
                cy.log("Change beginLat to 20");
                geoarc.setAttribute("begin-lat", 20);
            });

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["beginLat"]).to.equal(20);
            });
        });

        it("tests endLng property", () => {
            cy.mount(html`<ui5-geomap-arc end-lng="90"></ui5-geomap-arc>`).as("geomaparc");

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["endLng"]).to.equal(90);

                // Act
                cy.log("Change endLng to 90");
                geoarc.setAttribute("end-lng", 80);
            });

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["endLng"]).to.equal(80);
            });
        });

        it("tests endLat property", () => {
            cy.mount(html`<ui5-geomap-arc end-lat="70"></ui5-geomap-arc>`).as("geomaparc");

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["endLat"]).to.equal(70);

                // Act
                cy.log("Change endLat to 60");
                geoarc.setAttribute("end-lat", 60);
            });

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["endLat"]).to.equal(60);
            });
        });

        it("tests steps property", () => {
            cy.mount(html`<ui5-geomap-arc steps="100"></ui5-geomap-arc>`).as("geomaparc");

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["steps"]).to.equal(100);

                // Act
                cy.log("Change steps to 99");
                geoarc.setAttribute("steps", 99);
            });

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const state = geoarc._state;

                // Assert
                expect(state["steps"]).to.equal(99);
            });
        });
    });

    describe("test methods", () => {
        it("tests line method", () => {
            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                cy.spy(GeomapGeometry, "geomapLine");
                const geoarc = $geoarc.get(0);

                // Act
                geoarc.line;

                // Assert
                expect(GeomapGeometry.geomapLine.called).to.equal(true);
                expect(GeomapGeometry.geomapLine.calledWith([[geoarc.beginLng, geoarc.beginLat], [geoarc.endLng, geoarc.endLat]])).to.equal(true);
            });
        });

        it("tests getDistance method", () => {
            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                cy.spy(GeomapGeometry, "geomapCalculateDistance");
                const geoarc = $geoarc.get(0);
                const units = "kilometers";

                // Act
                geoarc.getDistance(units);

                // Assert
                expect(GeomapGeometry.geomapCalculateDistance.called).to.equal(true);
                expect(GeomapGeometry.geomapCalculateDistance.calledWith(geoarc.line, {units})).to.equal(true);
            });
        });

        it("tests sourceUpdateNeeded method", () => {
            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);

                // Act
                let result = geoarc.sourceUpdateNeeded({type: "test"});

                // Assert
                expect(result).to.equal(false);

                // Act
                result = geoarc.sourceUpdateNeeded({type: "property", name: "beginLng"});

                // Assert
                expect(result).to.equal(true);
            });
        });

        it("tests layerType method", () => {
            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);

                // Act
                const result = geoarc.layerType;

                // Assert
                expect(result).to.equal("line");
            });
        });

        it("tests layoutProperties method", () => {
            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);

                // Act
                const result = geoarc.layoutProperties;

                // Assert
                expect(result["line-join"]).to.equal("round");
            });
        });

        it("tests getPointAt", () => {
            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                cy.stub(GeomapGeometry, "geomapAlong").returns({
                    geometry: {
                        coordinates: [11, 51]
                    }
                });

                // Act
                const result = geoarc.getPointAt();

                // Assert
                expect(GeomapGeometry.geomapAlong.calledOnce).to.equal(true);
                expect(result.lng).to.equal(11);
                expect(result.lat).to.equal(51);

            });
        });

        it("tests sourceData", () => {

            cy.get("@geomaparc").then(($geoarc) => {
                // Arrange
                const geoarc = $geoarc.get(0);
                const coordinates = [11, 41];
                geoarc.endLng = 21;
                geoarc.endLat = 31;
                cy.stub(GeomapGeometry, "geomapCalculateDistance").returns(3);
                cy.stub(GeomapGeometry, "geomapAlong").returns({
                    geometry: {
                        coordinates: coordinates
                    }
                });
                cy.spy(GeomapGeometry, "geomapLine");

                // Act
                const result = geoarc.sourceData;

                // Assert
                expect(GeomapGeometry.geomapCalculateDistance.calledOnce).to.equal(true);
                expect(GeomapGeometry.geomapAlong.calledOnce).to.equal(true);
                expect(GeomapGeometry.geomapLine.callCount).to.equal(2);

                expect(result.geometry.coordinates).to.have.length(2);
                expect(result.geometry.coordinates[0]).to.have.length(2); // point geometry coordinates
                expect(result.geometry.coordinates[0][0]).to.equal(11); // point first coordinate
                expect(result.geometry.coordinates[0][1]).to.equal(41); // point second coordinate

                expect(result.geometry.coordinates[1]).to.have.length(2);
                expect(result.geometry.coordinates[1][0]).to.equal(21); // endLng
                expect(result.geometry.coordinates[1][1]).to.equal(31); // endLat
            });
        });
    });
});
