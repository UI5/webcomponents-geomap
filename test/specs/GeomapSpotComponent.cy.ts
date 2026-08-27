import { html } from "lit";
import "../../src/GeomapSpotComponent.js";

describe("ui5-geomap-spot-component", () => {
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
        it("tests icon property, BGSOFUISAKAR-1183", () => {
            cy.mount(html`<ui5-geomap-spot-component icon="myIcon"></ui5-geomap-spot-component>`).as("geomapspotcomponent");
            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["icon"]).to.equal("myIcon");

                // Act
                cy.log("Change icon to yourIcon");
                geospotcomponent.setAttribute("icon", "yourIcon");
            });

            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["icon"]).to.equal("yourIcon");
            });
        });

        it("tests width property, BGSOFUISAKAR-1183", () => {
            cy.mount(html`<ui5-geomap-spot-component width="3rem"></ui5-geomap-spot-component>`).as("geomapspotcomponent");
            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["width"]).to.equal("3rem");

                // Act
                cy.log("Change width to 4rem");
                geospotcomponent.setAttribute("width", "4rem");
            });

            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["width"]).to.equal("4rem");
            });
        });

        it("tests height property, BGSOFUISAKAR-1183", () => {
            cy.mount(html`<ui5-geomap-spot-component height="1rem"></ui5-geomap-spot-component>`).as("geomapspotcomponent");
            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["height"]).to.equal("1rem");

                // Act
                cy.log("Change height to 1.5rem");
                geospotcomponent.setAttribute("height", "1.5rem");
            });

            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["height"]).to.equal("1.5rem");
            });
        });

        it("tests opacity property, BGSOFUISAKAR-1183", () => {
            cy.mount(html`<ui5-geomap-spot-component opacity="0.8"></ui5-geomap-spot-component>`).as("geomapspotcomponent");
            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["opacity"]).to.equal("0.8");

                // Act
                cy.log("Change opacity to 0.6");
                geospotcomponent.setAttribute("opacity", "0.6");
            });

            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["opacity"]).to.equal("0.6");
            });
        });

        it("tests color property, BGSOFUISAKAR-1183", () => {
            cy.mount(html`<ui5-geomap-spot-component color="red"></ui5-geomap-spot-component>`).as("geomapspotcomponent");
            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["color"]).to.equal("red");

                // Act
                cy.log("Change color to blue");
                geospotcomponent.setAttribute("color", "blue");
            });

            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["color"]).to.equal("blue");
            });
        });

        it("tests lng property, BGSOFUISAKAR-1183", () => {
            cy.mount(html`<ui5-geomap-spot-component lng="5"></ui5-geomap-spot-component>`).as("geomapspotcomponent");
            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["lng"]).to.equal(5);

                // Act
                cy.log("Change lng to 6");
                geospotcomponent.setAttribute("lng", 6);
            });

            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["lng"]).to.equal(6);
            });
        });

        it("tests lat property, BGSOFUISAKAR-1183", () => {
            cy.mount(html`<ui5-geomap-spot-component lat="51"></ui5-geomap-spot-component>`).as("geomapspotcomponent");
            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["lat"]).to.equal(51);

                // Act
                cy.log("Change lat to 51");
                geospotcomponent.setAttribute("lat", 51);
            });

            cy.get("@geomapspotcomponent").then(($geospotcomponent) => {
                // Arrange
                const geospotcomponent = $geospotcomponent.get(0);
                const state = geospotcomponent._state;

                // Assert
                expect(state["lat"]).to.equal(51);
            });
        });
    });
});
