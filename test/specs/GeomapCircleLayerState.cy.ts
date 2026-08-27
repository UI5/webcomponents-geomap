import { html } from "lit";
import "../../src/GeomapCircleLayerState.js";

describe("ui5-geomap-circle-layer-state", () => {
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
        it("tests name property", () => {
            cy.mount(html`<ui5-geomap-circle-layer-state name="myName"></ui5-geomap-circle-layer-state>`).as("geomapcirclelayerstate");


            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["name"]).to.equal("myName");

                // Act
                cy.log("Change name to yourName");
                geocirclelayerstate.setAttribute("name", "yourName");
            });

            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["name"]).to.equal("yourName");
            });
        });

        it("tests radius property", () => {
            cy.mount(html`<ui5-geomap-circle-layer-state radius="3"></ui5-geomap-circle-layer-state>`).as("geomapcirclelayerstate");


            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["radius"]).to.equal(3);

                // Act
                cy.log("Change radius to 4");
                geocirclelayerstate.setAttribute("radius", 4);
            });

            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["radius"]).to.equal(4);
            });
        });

        it("tests outlineWidth property", () => {
            cy.mount(html`<ui5-geomap-circle-layer-state outline-width="3"></ui5-geomap-circle-layer-state>`).as("geomapcirclelayerstate");


            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["outlineWidth"]).to.equal(3);

                // Act
                cy.log("Change outlineWidth to 4");
                geocirclelayerstate.setAttribute("outline-width", 4);
            });

            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["outlineWidth"]).to.equal(4);
            });
        });

        it("tests opacity property", () => {
            cy.mount(html`<ui5-geomap-circle-layer-state opacity="0.6"></ui5-geomap-circle-layer-state>`).as("geomapcirclelayerstate");


            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["opacity"]).to.equal(0.6);

                // Act
                cy.log("Change opacity to 0.7");
                geocirclelayerstate.setAttribute("opacity", 0.7);
            });

            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["opacity"]).to.equal(0.7);
            });
        });

        it("tests outlineColor property", () => {
            cy.mount(html`<ui5-geomap-circle-layer-state outline-color="red"></ui5-geomap-circle-layer-state>`).as("geomapcirclelayerstate");


            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["outlineColor"]).to.equal("red");

                // Act
                cy.log("Change outline-color to 0.7");
                geocirclelayerstate.setAttribute("outline-color", "green");
            });

            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["outlineColor"]).to.equal("green");
            });
        });

        it("tests fillColor property", () => {
            cy.mount(html`<ui5-geomap-circle-layer-state fill-color="blue"></ui5-geomap-circle-layer-state>`).as("geomapcirclelayerstate");


            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["fillColor"]).to.equal("blue");

                // Act
                cy.log("Change fill-color to yellot");
                geocirclelayerstate.setAttribute("fill-color", "yellow");
            });

            cy.get("@geomapcirclelayerstate").then(($geocirclelayerstate) => {
                // Arrange
                const geocirclelayerstate = $geocirclelayerstate.get(0);
                const state = geocirclelayerstate._state;

                // Assert
                expect(state["fillColor"]).to.equal("yellow");
            });
        });

    });
});
