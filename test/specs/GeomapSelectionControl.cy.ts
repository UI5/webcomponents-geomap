import { html } from "lit";
import "../../src/GeomapSelectionControl.js";
import GeomapSelectionControlComponent from "../../src/GeomapSelectionControlComponent.js";
import "../../src/Geomap.js"
import "../../src/GeomapCircle.js"
import "../../src/GeomapContainer.js"
import "../../src/GeomapSource.js"
import "../../src/GeomapProvider.js"
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";


describe("ui5-geomap-selection-control", () => {
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
        cy.mount(html`<ui5-geomap-selection-control></ui5-geomap-selection-control>`).as("geomapselectioncontrol");

    });

    describe("test properties", () => {
        it("tests selectionType property, BGSOFUISAKAR-1168", () => {
            cy.mount(html`<ui5-geomap-selection-control selection-type="freehand"></ui5-geomap-selection-control>`).as("geomapselectioncontrol");


            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                const state = geoselectioncontrol._state;

                // Assert
                expect(state["selectionType"]).to.equal("freehand");

                // Act
                cy.log("Change selectionType to polygon");
                geoselectioncontrol.setAttribute("selection-type", "polygon");
            });

            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                const state = geoselectioncontrol._state;

                // Assert
                expect(state["selectionType"]).to.equal("polygon");
            });
        });
    });
    describe("test methods", () => {
        it("tests _checkEnabled method, BGSOFUISAKAR-1168", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);

                // Act
                let check = geoselectioncontrol._checkEnabled();

                // Assert
                expect(check).to.equal(false);

                // Arrange
                const component = new GeomapSelectionControlComponent();
                component._terraDraw = {
                    enabled: true
                }
                geoselectioncontrol._instance._container = component;

                // Act
                check = geoselectioncontrol._checkEnabled();

                // Assert
                expect(check).to.equal(true);
            });
        });
		it("tests setModeStyles method, BGSOFUISAKAR-1168", () => {
			cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
				// Arrange
				const geoselectioncontrol = $geoselectioncontrol.get(0);
				let c = 0;
				const component = new GeomapSelectionControlComponent();
				component._terraDraw = {
					enabled: true
				}
				geoselectioncontrol._instance._container = component;
				geoselectioncontrol._instance._container.setModeStyles = () => {
					c++;
				};

				// Act
				geoselectioncontrol.setModeStyles();

				// Assert
				expect(c).to.equal(1);
			});
		});

		it("tests isSelectionMapControl method - BGSOFUISAKAR-1321", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);

                // Act
                let check = geoselectioncontrol.isSelectionMapControl;

                // Assert
                expect(check).to.equal(true);
            });
        });

        it("tests handleInvalidation method, BGSOFUISAKAR-1168", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                cy.stub(geoselectioncontrol, "_checkEnabled").returns(true);
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                geoselectioncontrol.map = map;
                let callCount = 0;
                const component = new GeomapSelectionControlComponent();
                component._terraDraw = {
                    setMode: () => {
                        callCount++;
                    }
                }

                geoselectioncontrol._instance._container = component;

                cy.stub(component, "setModeStyles");
                cy.stub(component, "updateAllSelectionStyles");

                // Act
                geoselectioncontrol.handleInvalidation({type: "property", name: "selectionType"});

                // Assert
                expect(component.setModeStyles.calledOnce).to.equal(true);
                expect(component.updateAllSelectionStyles.calledOnce).to.equal(true);
                expect(callCount).to.equal(1);
            });
        });

        it("tests selections method, BGSOFUISAKAR-1168", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);

                const component = new GeomapSelectionControlComponent();
                geoselectioncontrol._instance._container = component;

                component._terraDraw = {
                    getSnapshot: () => {
                       return ["mySelections"];
                    }
                }

                // Act
                const result = geoselectioncontrol.selections;

                // Assert
                expect(result[0]).to.equal("mySelections");
            });
        });

        it("tests setValidator method, BGSOFUISAKAR-1168", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);

                const component = new GeomapSelectionControlComponent();
                cy.spy(component, "setValidator");
                const validator = () => {};
                // TODO why can stub selections method?

                geoselectioncontrol._instance._container = component;

                // Act
                geoselectioncontrol.setValidator(validator);

                // Assert
                expect(geoselectioncontrol._validator).to.equal(validator);
                expect(component.setValidator.calledWith(validator)).to.equal(true);
            });
        });

        it("renders all selection mode buttons by default", () => {
            cy.mount(html`<ui5-geomap-selection-control></ui5-geomap-selection-control>`).as("geomapselectioncontrol");

            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                expect(geoselectioncontrol.modes).to.deep.equal([]);
            });
        });

        it("filters selection mode buttons via the modes property", () => {
            cy.mount(html`<ui5-geomap-selection-control .modes=${["rectangle", "circle"]}></ui5-geomap-selection-control>`)
                .as("geomapselectioncontrol");

            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                expect(geoselectioncontrol.modes).to.deep.equal(["rectangle", "circle"]);
            });
        });

        it("propagates modes through handleInvalidation", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                cy.stub(geoselectioncontrol, "_checkEnabled").returns(true);
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                geoselectioncontrol.map = map;

                const component = new GeomapSelectionControlComponent();
                component._terraDraw = { setMode: () => {} };
                geoselectioncontrol._instance._container = component;
                cy.stub(component, "setModeStyles");
                cy.stub(component, "updateAllSelectionStyles");

                geoselectioncontrol.modes = ["polygon", "select"];

                // Act
                geoselectioncontrol.handleInvalidation({ type: "property", name: "modes" });

                // Assert
                expect(component.modes).to.deep.equal(["polygon", "select"]);
            });
        });

        it("propagates modes before terraDraw is activated", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                cy.stub(geoselectioncontrol, "_checkEnabled").returns(false);
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                geoselectioncontrol.map = map;

                const component = new GeomapSelectionControlComponent();
                geoselectioncontrol._instance._container = component;

                geoselectioncontrol.modes = ["rectangle"];

                // Act
                geoselectioncontrol.handleInvalidation({ type: "property", name: "modes" });

                // Assert
                expect(component.modes).to.deep.equal(["rectangle"]);
            });
        });

        it("_pushModes is a no-op when the inner container is missing", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                geoselectioncontrol._instance._container = undefined;
                geoselectioncontrol.modes = ["polygon"];
                geoselectioncontrol.selectionType = "rectangle";

                // Act / Assert
                expect(() => geoselectioncontrol._pushModes()).to.not.throw();
                expect(geoselectioncontrol.selectionType).to.equal("rectangle");
            });
        });

        it("re-syncs selectionType when removed from modes", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const geoselectioncontrol = $geoselectioncontrol.get(0);
                cy.stub(geoselectioncontrol, "_checkEnabled").returns(false);
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                geoselectioncontrol.map = map;

                const component = new GeomapSelectionControlComponent();
                geoselectioncontrol._instance._container = component;

                geoselectioncontrol.selectionType = "rectangle";
                geoselectioncontrol.modes = ["polygon", "select"];

                // Act
                geoselectioncontrol.handleInvalidation({ type: "property", name: "modes" });

                // Assert
                expect(geoselectioncontrol.selectionType).to.equal("polygon");
            });
        });

        it("forwards selection-finish from the wrapper to the public event", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const ctrl = $geoselectioncontrol.get(0);
                const finishHandler = cy.stub();
                ctrl.addEventListener("selection-finish", (e) => finishHandler(e.detail));

                // Act - manually invoke the callback the wrapper would dispatch
                const detail = { id: "abc", context: { updateType: "finish" }, snapshot: [] };
                ctrl._instance.options.selectionFinishCallback({ detail });

                // Assert
                expect(finishHandler.calledOnce).to.equal(true);
                expect(finishHandler.firstCall.args[0]).to.deep.equal(detail);
            });
        });

        it("forwards selection-item from the wrapper to the public event", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const ctrl = $geoselectioncontrol.get(0);
                const itemHandler = cy.stub();
                ctrl.addEventListener("selection-item", (e) => itemHandler(e.detail));

                // Act
                const detail = { id: "xyz", snapshot: [], selObj: undefined };
                ctrl._instance.options.selectionItemCallback({ detail });

                // Assert
                expect(itemHandler.calledOnce).to.equal(true);
                expect(itemHandler.firstCall.args[0]).to.deep.equal(detail);
            });
        });

        it("the default validator returns valid", () => {
            cy.get("@geomapselectioncontrol").then(($geoselectioncontrol) => {
                // Arrange
                const ctrl = $geoselectioncontrol.get(0);

                // Act / Assert
                expect(ctrl._validator()).to.deep.equal({ valid: true, reason: undefined });
            });
        });
    });
});
