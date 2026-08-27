import GeomapSelectionControlComponent from "../../src/GeomapSelectionControlComponent.js";
import {
	TerraDraw,
	TerraDrawFreehandMode,
	TerraDrawRectangleMode,
	TerraDrawCircleMode,
	TerraDrawPolygonMode,
	TerraDrawSelectMode,
} from "terra-draw";
import { Map } from "../../src/MapLibre.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";


describe("ui5-geomap-selection-control-component", () => {
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
        it("tests default properties", () => {
                // Arrange
                const component = new GeomapSelectionControlComponent();

                // Assert
                expect(component.selectionType).to.equal("rectangle");
        });
    });
    describe("test methods", () => {
        it("tests onExitDOM", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
            component._terraDraw = true;
            // cy.stub(component, "endSelection");
            cy.stub(component, "removeSelection");

            // Act
            component.onExitDOM();

            // Assert
            // expect(component.endSelection.calledOnce).to.equal(true);
            expect(component.removeSelection.calledOnce).to.equal(true);
        });

        it("tests startSelection, BGSOFUISAKAR-1168", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
			const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            const adapter = new TerraDrawMapLibreGLAdapter({map: map });
            const terraDraw = new TerraDraw({
                adapter: adapter,
                modes: [new TerraDrawFreehandMode([{ ...component._selectionStyles.freehand }])]
            });
            component._terraDraw = terraDraw;
            cy.stub(terraDraw, "start");
            cy.stub(terraDraw, "setMode");
            cy.stub(terraDraw, "setModeStyles");

            // Act
            component.startSelection("freehand");

            // Assert
            expect(component.selectionType).to.equal("freehand");
            expect(terraDraw.start.calledOnce).to.equal(true);
            expect(terraDraw.setMode.calledOnce).to.equal(true);
            expect(terraDraw.setModeStyles.calledOnce).to.equal(true);

			// Arrange
			component._terraDraw = null;

			// Assert
			const r = component.startSelection("freehand");
			expect(r).to.equal(undefined);
        });

        it("tests endSelection, BGSOFUISAKAR-1168, BGSOFUISAKAR-1321", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
			const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            const adapter = new TerraDrawMapLibreGLAdapter({map: map });
            component._adapter = adapter;
            const terraDraw = new TerraDraw({
                adapter: adapter,
                modes: [
					new TerraDrawSelectMode(),
					new TerraDrawFreehandMode([{ ...component._selectionStyles.freehand }])
				]
            });
            component._terraDraw = terraDraw;
            cy.stub(terraDraw, "stop");
            cy.stub(component._adapter, "setCursor");


            // Act
			component.startSelection("freehand");
            component.endSelection();

            // Assert
            expect(terraDraw.stop.calledOnce).to.equal(true);
            expect(adapter.setCursor.called).to.equal(true);
            expect(adapter.setCursor.calledWith("unset")).to.equal(true);

			component._terraDraw = null;
			expect(component.endSelection()).to.equal(undefined);
        });

		it("tests removeSelection, BGSOFUISAKAR-1168, BGSOFUISAKAR-1321", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
			const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            const adapter = new TerraDrawMapLibreGLAdapter({map: map });
            component._adapter = adapter;
            const terraDraw = new TerraDraw({
                adapter: adapter,
                modes: [
					new TerraDrawSelectMode(),
					new TerraDrawFreehandMode([{ ...component._selectionStyles.freehand }])
				]
            });
            component._terraDraw = terraDraw;
            cy.stub(terraDraw, "stop");
            cy.stub(component._adapter, "setCursor");


            // Act
            component.removeSelection();

            // Assert
            expect(terraDraw.stop.calledOnce).to.equal(false);
            expect(adapter.setCursor.callCount).to.equal(1);
            expect(adapter.setCursor.calledOnceWith("unset")).to.equal(true);

			component._terraDraw = null;
			expect(component.removeSelection()).to.equal(undefined);
        });

		it("tests addExistingMapFeatures, BGSOFUISAKAR-1168, BGSOFUISAKAR-1321", () => {
			// Arrange
			const component = new GeomapSelectionControlComponent();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const adapter = new TerraDrawMapLibreGLAdapter({map: map });
			component._adapter = adapter;
			const terraDraw = new TerraDraw({
				adapter: adapter,
				modes: [
					new TerraDrawSelectMode(),
					new TerraDrawFreehandMode([{ ...component._selectionStyles.freehand }])
				]
			});
			component._terraDraw = terraDraw;
			cy.stub(terraDraw, "addFeatures");


			// Act
			component.addExistingMapFeatures();

			// Assert
			expect(terraDraw.addFeatures.callCount).to.equal(0);


			// Act
			component.addExistingMapFeatures([
				{
					id: "04324023534sa",
					type: "Feature",
					properties: {
						mode: "linestring",
					},
					geometry: {
						type: "LineString",
						coordinates: [
							[8.6821, 50.1109],
							[11.0767, 49.4521],
							[10.90067, 49.89873],
							[11.578783087434374, 49.935896203951074],
						],
					},
				},
			]);
			// Assert
			expect(terraDraw.addFeatures.callCount).to.equal(1);

		});
		it("tests getExistingFeatures, BGSOFUISAKAR-1168, BGSOFUISAKAR-1321", () => {
			// Arrange
			const component = new GeomapSelectionControlComponent();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const adapter = new TerraDrawMapLibreGLAdapter({map: map});
			component._adapter = adapter;
			const terraDraw = new TerraDraw({
				adapter: adapter,
				modes: [
					new TerraDrawSelectMode(),
					new TerraDrawFreehandMode([{...component._selectionStyles.freehand}])
				]
			});
			component._terraDraw = terraDraw;

			const f = {
				id: "04324023534sa",
				type: "Feature",
				properties: {
					mode: "linestring",
					isExistingFeature: true,
				},
				geometry: {
					type: "LineString",
					coordinates: [
						[8.6821, 50.1109],
						[11.0767, 49.4521],
						[10.90067, 49.89873],
						[11.578783087434374, 49.935896203951074],
					],
				},
			};
			const feat = {
				"04324023534sa": f,
			};
			component._terraDraw._store.store = feat;


			// Act
			const r = component.getExistingFeatures();

			// Assert
			expect(r).to.deep.equal([f]);
		});

        it("tests setModeStyles, BGSOFUISAKAR-1168", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
			const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            const adapter = new TerraDrawMapLibreGLAdapter({map: map });
            component._adapter = adapter;
            const terraDraw = new TerraDraw({
                adapter: adapter,
                modes: [new TerraDrawFreehandMode([{ ...component._selectionStyles.freehand }])]
            });
            component._terraDraw = terraDraw;
            cy.stub(component, "_checkEnabled").returns(true);
            cy.stub(terraDraw, "setModeStyles");
            const styles = {
                outlineColor: "red",
                outlineWidth: 5,
                fillOpacity: 0.7,
                fillColor: "blue",
                width: 3
            };

            // Act
            component.setModeStyles("circle", styles);

            // Assert
            expect(terraDraw.setModeStyles.calledOnce).to.equal(true);
            expect(terraDraw.setModeStyles.calledWith("circle", styles)).to.equal(true);
        });

        it("tests setSelectionMode, BGSOFUISAKAR-1168, BGSOFUISAKAR-1674", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
			cy.stub(component, "startSelection");
			const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            const adapter = new TerraDrawMapLibreGLAdapter({map: map });
            component._adapter = adapter;
            const terraDraw = new TerraDraw({
                adapter: adapter,
                modes: [new TerraDrawFreehandMode([{ ...component._selectionStyles.freehand }])]
            });
            component._terraDraw = terraDraw;
            cy.stub(terraDraw, "setModeStyles");
            const styles = {
                outlineColor: "red",
                outlineWidth: 5,
                fillOpacity: 0.7,
                fillColor: "blue",
                width: 3
            };

			// Act
			const attributes = {
				"data-ui5-mode": "circle",
				design: "Default",
			};

            // Act
			const e = {
				target:  {
					attributes: attributes,
					getAttribute: (prop: string) => {
						return attributes[prop];
					},
					setAttribute: (prop: string, value: string) => {
						attributes[prop] = value;
					},
				}
			}
            component.setSelectionMode(e);

            expect(component.startSelection.calledOnce).to.equal(true);
        });

		it("preserve selectionMode, BGSOFUISAKAR-1674", () => {
			// Arrange
			const component = new GeomapSelectionControlComponent();
			cy.stub(component, "startSelection");
			cy.stub(component, "deselectAllOptions");
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const adapter = new TerraDrawMapLibreGLAdapter({map: map });
			component._adapter = adapter;
			const terraDraw = new TerraDraw({
				adapter: adapter,
				modes: [new TerraDrawFreehandMode([{ ...component._selectionStyles.freehand }])]
			});
			component._terraDraw = terraDraw;
			cy.stub(terraDraw, "setModeStyles");
			const styles = {
				outlineColor: "red",
				outlineWidth: 5,
				fillOpacity: 0.7,
				fillColor: "blue",
				width: 3
			};

			const attributes = {
				"data-ui5-mode": "circle",
				design: "Default",
			};

			// Act
			const e = {
				target:  {
					attributes: attributes,
					getAttribute: (prop: string) => {
						return attributes[prop];
					},
					setAttribute: (prop: string, value: string) => {
						attributes[prop] = value;
					},
				}
			}
			component.setSelectionMode(e);

			expect(component.startSelection.calledOnce).to.equal(true);
			expect(component.deselectAllOptions.calledOnce).to.equal(true);
			expect(e.target.attributes["design"]).to.equal("Emphasized");
		});

        it("tests updateAllSelectionStyles, BGSOFUISAKAR-1168", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();

            const keys = Object.keys(component._selectionStyles);
            const styles = {
                outlineColor: "red",
                outlineWidth: 5,
                fillOpacity: 0.7,
                fillColor: "blue",
                width: 3
            };

            // Act
            component.updateAllSelectionStyles(styles);

            // Assert
            keys.forEach((key) => {
                expect(component._selectionStyles[key].styles).to.equal(styles);
            });
        });

        it("tests setValidator, BGSOFUISAKAR-1168", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
            const validator = () => {};

            // Act
            component.setValidator(validator);

            // Assert
            expect(component._validator).to.equal(validator);
        });

        it("tests startDraw", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
            cy.stub(component, "startSelection");

            // Act
            component.startDraw();

            // Assert
            expect(component.startSelection.calledOnce).to.equal(true);
        });

        it("tests endDraw, BGSOFUISAKAR-1168, BGSOFUISAKAR-1674", () => {
            // Arrange
            const component = new GeomapSelectionControlComponent();
            cy.stub(component, "endSelection");
			cy.stub(component, "deselectAllOptions");

            // cy.stub(component, "removeSelection");

			const attributes = {
				"data-ui5-mode": "circle",
				design: "Default",
			};

			// Act
			const e = {
				target:  {
					attributes: attributes,
					getAttribute: (prop: string) => {
						return attributes[prop];
					},
					setAttribute: (prop: string, value: string) => {
						attributes[prop] = value;
					},
				}
			}
            // Act
            component.endDraw(e);

            // Assert
            expect(component.endSelection.calledOnce).to.equal(true);
			expect(component.deselectAllOptions.calledOnce).to.equal(true);
            // expect(component.removeSelection.calledOnce).to.equal(true);
        });

		it("tests selections, BGSOFUISAKAR-1168", () => {
			// Arrange
			const component = new GeomapSelectionControlComponent();
			cy.stub(component, "startSelection");
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const adapter = new TerraDrawMapLibreGLAdapter({map: map });
			component._adapter = adapter;
			const terraDraw = new TerraDraw({
				adapter: adapter,
				modes: [new TerraDrawFreehandMode([{ ...component._selectionStyles.freehand }])]
			});
			component._terraDraw = terraDraw;
			const styles = {
				outlineColor: "red",
				outlineWidth: 5,
				fillOpacity: 0.7,
				fillColor: "blue",
				width: 3
			};
			const snap = cy.stub(terraDraw, "getSnapshot");
			snap.returns([{
				id: "dummyId",
				"type": "Feature",
				"geometry": {
					"type:": "Polygon",
					"coordinates": []
				}
			}]);

			const expected = {
				"type": "Feature",
				"geometry": {
					"type:": "Polygon",
					"coordinates": []
				}
			};

			// Act
			const r = component.selections;
			expect(r[0]).to.deep.equal(expected);
		});

		it("tests onEnterDom",  () => {
			// Arrange
			const component = new GeomapSelectionControlComponent();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			component.map = map;

			// Act
			component.onEnterDOM().then(() => {

				// Assert
				expect(component._adapter).to.exist;
				expect(component._terraDraw).to.exist;
			});
		});

		it("effectiveModes returns all modes by default", () => {
			const component = new GeomapSelectionControlComponent();
			expect(component.effectiveModes).to.deep.equal([
				"freehand",
				"polygon",
				"rectangle",
				"circle",
				"select",
			]);
		});

		it("effectiveModes returns the configured subset", () => {
			const component = new GeomapSelectionControlComponent();
			component.modes = ["rectangle", "circle"];
			expect(component.effectiveModes).to.deep.equal(["rectangle", "circle"]);
		});

		it("effectiveModes treats null modes as empty", () => {
			const component = new GeomapSelectionControlComponent();
			component.modes = null;
			expect(component.effectiveModes).to.deep.equal([
				"freehand",
				"polygon",
				"rectangle",
				"circle",
				"select",
			]);
		});

		it("effectiveModes returns a defensive copy on fallback", () => {
			const a = new GeomapSelectionControlComponent();
			const b = new GeomapSelectionControlComponent();
			const fromA = a.effectiveModes;
			fromA.push("bogus");
			fromA.shift();
			expect(b.effectiveModes).to.deep.equal([
				"freehand",
				"polygon",
				"rectangle",
				"circle",
				"select",
			]);
		});

		it("effectiveModes ignores unknown modes and falls back to defaults", () => {
			const component = new GeomapSelectionControlComponent();
			component.modes = ["bogus"];
			expect(component.effectiveModes).to.deep.equal([
				"freehand",
				"polygon",
				"rectangle",
				"circle",
				"select",
			]);
		});

		it("_validateModes warns on unknown values", () => {
			const component = new GeomapSelectionControlComponent();
			const warn = cy.stub(console, "warn");
			component.modes = ["bogus"];
			component._validateModes();
			expect(warn.calledOnce).to.equal(true);
			expect(warn.firstCall.args[0]).to.contain("bogus");
		});

		it("_validateModes warns on partially-unknown values", () => {
			const component = new GeomapSelectionControlComponent();
			const warn = cy.stub(console, "warn");
			component.modes = ["rectangle", "bogus", "select"];
			component._validateModes();
			expect(component.effectiveModes).to.deep.equal(["rectangle", "select"]);
			expect(warn.calledOnce).to.equal(true);
			expect(warn.firstCall.args[0]).to.contain("bogus");
		});

		it("_validateModes is silent on valid input", () => {
			const component = new GeomapSelectionControlComponent();
			const warn = cy.stub(console, "warn");
			component.modes = ["rectangle", "select"];
			component._validateModes();
			expect(warn.called).to.equal(false);
		});

		it("_validateModes does not warn twice for the same unknown value", () => {
			const component = new GeomapSelectionControlComponent();
			const warn = cy.stub(console, "warn");
			component.modes = ["bogus"];
			component._validateModes();
			component._validateModes();
			expect(warn.calledOnce).to.equal(true);
		});

		it("_validateModes warns again when the unknown set changes", () => {
			const component = new GeomapSelectionControlComponent();
			const warn = cy.stub(console, "warn");
			component.modes = ["bogus"];
			component._validateModes();
			component.modes = ["other-bogus"];
			component._validateModes();
			expect(warn.callCount).to.equal(2);
		});

		it("_validateModes resets after a clean assignment", () => {
			const component = new GeomapSelectionControlComponent();
			const warn = cy.stub(console, "warn");
			component.modes = ["bogus"];
			component._validateModes();
			component.modes = ["rectangle"];
			component._validateModes();
			component.modes = ["bogus"];
			component._validateModes();
			expect(warn.callCount).to.equal(2);
		});

		it("effectiveModes survives non-array modes without throwing", () => {
			const component = new GeomapSelectionControlComponent();
			component.modes = "rectangle";
			expect(() => component.effectiveModes).to.not.throw();
			expect(component.effectiveModes).to.deep.equal([
				"freehand",
				"polygon",
				"rectangle",
				"circle",
				"select",
			]);
		});

		it("_validateModes survives non-array modes without throwing", () => {
			const component = new GeomapSelectionControlComponent();
			const warn = cy.stub(console, "warn");
			component.modes = "rectangle";
			expect(() => component._validateModes()).to.not.throw();
			expect(warn.called).to.equal(false);
		});

		it("setSelectionMode is a no-op when data-ui5-mode is missing", () => {
			const component = new GeomapSelectionControlComponent();
			cy.stub(component, "startSelection");
			const initial = component.selectionType;

			const event = {
				target: {
					getAttribute: () => null,
					setAttribute: () => {},
					parentNode: { getElementsByTagName: () => [] },
				},
			};
			component.setSelectionMode(event);

			expect(component.startSelection.called).to.equal(false);
			expect(component.selectionType).to.equal(initial);
		});

		it("effectiveModes is pure (no warning on every call)", () => {
			const component = new GeomapSelectionControlComponent();
			const warn = cy.stub(console, "warn");
			component.modes = ["bogus"];
			component.effectiveModes;
			component.effectiveModes;
			component.effectiveModes;
			expect(warn.called).to.equal(false);
		});

		it("default _validator returns valid", () => {
			const component = new GeomapSelectionControlComponent();
			expect(component._validator()).to.deep.equal({ valid: true, reason: undefined });
		});

		it("deselectAllOptions resets sibling ui5-button design attributes", () => {
			const parent = document.createElement("div");
			const target = document.createElement("ui5-button");
			const sibling1 = document.createElement("ui5-button");
			const sibling2 = document.createElement("ui5-button");
			sibling1.setAttribute("design", "Emphasized");
			sibling2.setAttribute("design", "Emphasized");
			parent.appendChild(target);
			parent.appendChild(sibling1);
			parent.appendChild(sibling2);

			const component = new GeomapSelectionControlComponent();
			component.deselectAllOptions(target);

			expect(sibling1.getAttribute("design")).to.equal("Default");
			expect(sibling2.getAttribute("design")).to.equal("Default");
		});
    });
});
