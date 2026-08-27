import GeomapLayerBase from "../../src/GeomapLayerBase.js";
import Map from "../../src/extensions/Map.js";
import { MapLayerEventType } from "maplibre-gl";
import {setWorkerUrl} from "../../src/MapLibre.js";


describe("GeomapLayerBase", () => {
	beforeEach(() => {
		// runs before each test in this block
		setWorkerUrl("dummy");
	});
    describe("test properties", () => {
        it("tests default properties", () => {
            // Arrange
            window.customElements.define('my-custom-element', GeomapLayerBase); // only the first time register the custom element
			const c = new GeomapLayerBase();

            // Assert
            expect(c.minZoom).to.equal(0);
            expect(c.maxZoom).to.equal(0);
            expect(c.displayedFeatures).to.equal("All");
            expect(c.hidden).to.equal(false);
            expect(c.zIndex).to.equal(0);
        });

    });
    describe("test methods", () => {
        it("tests onExitDOM method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();
            cy.stub(layerbase, "removeLayer");
            layerbase.map = true;

            // Act
            layerbase.onExitDOM();

            // Assert
            expect(layerbase.removeLayer.calledOnce).to.equal(true);
        });

        it("tests _getInsertBeforeLayerId method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();
            layerbase.zIndex = 1;
            const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            layerbase.map = map;
            const layers = [{
                metadata: {
                    zIndex: 3
                },
                id: "myId"
            }];
            const st = cy.stub(map, "getStyle");
            st.returns({layers: layers});

            // Act
           const id = layerbase._getInsertBeforeLayerId();

            // Assert
            expect(id).to.equal("myId");
        });

        it("tests _getEffectiveFilter method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();
            let filter = ["filter"];
            layerbase.filter = filter;

            // Act
           let result = layerbase._getEffectiveFilter();

            // Assert
            expect(result).to.equal(filter);

			// Arrange
			layerbase.filter = "";
			layerbase.displayedFeatures = "NotClustered";
			filter = ["!", ["has", "point_count"]];

			// Act
			result = layerbase._getEffectiveFilter();

			// Assert
			expect(result).to.deep.equal(filter);

			// Arrange
			layerbase.filter = "";
			layerbase.displayedFeatures = "Clustered";
			filter = ["has", "point_count"];

			// Act
			result = layerbase._getEffectiveFilter();

			// Assert
			expect(result).to.deep.equal(filter);

        });

        it("tests removeLayer method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();
            const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            layerbase.map = map;
            cy.stub(map, "removeLayer");

            // Act
           layerbase.removeLayer();

            // Assert
            expect(map.removeLayer.calledOnce).to.equal(true);
            expect(map.removeLayer.calledWith(layerbase._id)).to.equal(true);
        });

        it("tests updateLayerProperties method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();
            cy.stub(layerbase, "_getPropertiesOfType").returns({first: "first"});

            const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            layerbase.map = map;
            cy.stub(map, "setPaintProperty");
            cy.stub(map, "setLayoutProperty");

            // Act
           layerbase.updateLayerProperties();

            // Assert
            expect(map.setPaintProperty.calledOnce).to.equal(true);
            expect(map.setLayoutProperty.calledOnce).to.equal(true);
        });

        it("tests handleInvalidation method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();

            const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            cy.stub(map, "getLayer").returns(true);
            cy.stub(layerbase, "_getInsertBeforeLayerId");
            cy.stub(layerbase, "_getPropertyValue").returns("black");
            layerbase.map = map;
            cy.stub(map, "setFilter");
            cy.stub(map, "setLayerZoomRange");
            cy.stub(map, "moveLayer");
            cy.stub(map, "setPaintProperty");

            // Act
           layerbase.handleInvalidation({type: "property", name: "filter"});

            // Assert
            expect(map.setFilter.calledOnce).to.equal(true);

            // Act
           layerbase.handleInvalidation({type: "property", name: "minZoom"});

            // Assert
            expect(map.setLayerZoomRange.calledOnce).to.equal(true);

            // Act
           layerbase.handleInvalidation({type: "property", name: "zIndex"});

            // Assert
            expect(map.moveLayer.calledOnce).to.equal(true);

        });

        it("tests layerSource method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();

            // Act
           const result = layerbase.layerSource;

            // Assert
            expect(result).to.equal("");
        });

        it("tests sourceData method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();

            // Act
           const result = layerbase.sourceData;

            // Assert
            expect(result.type).to.equal("Feature");
        });

        it("tests layerType method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();

            // Act
           const result = layerbase.layerType;

            // Assert
            expect(result).to.equal("");
        });

        it("tests stateDragging method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();

            // Act
           const result = layerbase.stateDragging;

            // Assert
            expect(result).to.equal(false);
        });

        it("tests _fnSorter method", () => {
			// Arrange
			const layerbase = new GeomapLayerBase();
			let l1 = {metadata: {zIndex: 1}},
				l2 = {metadata: {zIndex: 2}};

			// Act
			let result = layerbase._fnSorter(l1, l2);

			// Assert
			expect(result).to.equal(-1);

			// Arrange
			l1 = {metadata: {zIndex: 2}};
			l2 = {metadata: {zIndex: 1}};

			// Act
			result = layerbase._fnSorter(l1, l2);

			// Assert
			expect(result).to.equal(1);

			// Arrange
			l1 = {metadata: {zIndex: 1}};
			l2 = {metadata: {zIndex: 1}};

			// Act
			result = layerbase._fnSorter(l1, l2);

			// Assert
			expect(result).to.equal(0);
        });

        it("tests isGeoMapLayer method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();

            // Act
           const result = layerbase.isGeoMapLayer;

            // Assert
            expect(result).to.equal(true);
        });

        it("tests paintProperties method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();
            cy.stub(layerbase, "_getPropertiesOfType");

            // Act
           layerbase.paintProperties;

            // Assert
            expect(layerbase._getPropertiesOfType.calledWith("paint")).to.equal(true);
        });

        it("tests layoutProperties method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();
            cy.stub(layerbase, "_getPropertiesOfType");

            // Act
           layerbase.layoutProperties;

            // Assert
            expect(layerbase._getPropertiesOfType.calledWith("layout")).to.equal(true);
        });

        it("tests layer method", () => {
            // Arrange
			const layerbase = new GeomapLayerBase();
            const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            layerbase.map = map;
            cy.stub(map, "getLayer");

            // Act
           layerbase.layer;

            // Assert
            expect(map.getLayer.calledOnce).to.equal(true);
            expect(map.getLayer.calledWith(layerbase._id)).to.equal(true);
        });


		it("tests onEnterDOM method", () => {
			// Arrange
			const layerBase = new GeomapLayerBase();

			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			layerBase.map = map;
			layerBase.whenMapConnected = () => {
				return new Promise((resolve) => {
					resolve("done");
				});
			};
			layerBase.whenMapLoaded = () => {
				return new Promise((resolve) => {
					resolve("done");
				});
			};
			let countCreateLayerCalled = 0, countUpdateLayerProperties  = 0;
			layerBase.createLayer =  () => {
				countCreateLayerCalled++;
			};
			layerBase.updateLayerProperties =  () => {
				countUpdateLayerProperties++;
			};

			// Act
			layerBase.onEnterDOM().then(() => {

				// Assert
				expect(countCreateLayerCalled).to.equal(1);
				expect(countUpdateLayerProperties).to.equal(1);
			});

		});

		it("tests createLayer method", () => {
			// Arrange
			const layerBase = new GeomapLayerBase();

			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5,
				style: "https://demotiles.maplibre.org/style.json"
			});
			layerBase.map = map;
			layerBase.minZoom = 3;
			layerBase.maxZoom = 3;
			layerBase.filter = ["filter"];
			layerBase.whenMapConnected = () => {
				return new Promise((resolve) => {
					resolve("done");
				});
			};
			layerBase.whenMapLoaded = () => {
				return new Promise((resolve) => {
					resolve("done");
				});
			};
			let coutAddLayerCalled = 0, coutGetLayerCalled = 0, countUpdateLayerProperties  = 0;
			map.addLayer =  () => {
				coutAddLayerCalled++;
			};
			map.getLayer =  () => {
				coutGetLayerCalled++;
			};

			layerBase.updateLayerProperties =  () => {
				countUpdateLayerProperties++;
			};

			layerBase._getInsertBeforeLayerId = () => {};

			// Act
			layerBase.createLayer();
			layerBase.map.style.fire("styledata");

			// Assert
			expect(coutAddLayerCalled).to.equal(2);
			expect(coutGetLayerCalled).to.equal(1);
			expect(countUpdateLayerProperties).to.equal(1);

		});

		it("tests handleDraggable method", () => {
			// Arrange
			const layerBase = new GeomapLayerBase();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			layerBase.map = map;
			layerBase.__id = "testId";
			let c = 0;
			const fnCallback = () => {
				c++;
			};
			cy.stub(map, "getCanvasContainer");
			cy.stub(map, "setPaintProperty");
			let r = layerBase.handleDraggable();

			// Assert
			expect(r).to.equal(undefined);

			// Act
			layerBase.handleDraggable("fill-color", "red", fnCallback);

			// Assert
			expect(map.getCanvasContainer.calledOnce).to.equal(true);
		});

		it("tests _getPropertyValue method", () => {
			// Arrange
			const layerBase = new GeomapLayerBase();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			layerBase.map = map;
			layerBase.__id = "testId";
			let r = layerBase._getPropertyValue("minZoom", {
				formatter: function() {
					return 1;
				}
			});

			// Assert
			expect(r).to.equal(1);

			// Act
			r = layerBase._getPropertyValue("minZoom", {});

			// Assert
			expect(r).to.equal(0);
		});

		it("tests getFocusDomRef method", () => {
			// Arrange
			const layerbase = new GeomapLayerBase();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const fakeElement = document.createElement("span");
			const fakeMarker = {
				getElement: () => fakeElement
			};

			layerbase.map = map;
			cy.spy(layerbase, "getFocusDomRef").as("getFocusDomRefSpy");


			cy.stub(layerbase.map, "getHelperMarker").returns(fakeMarker);


			// Act
			const focusDomRef = layerbase.getFocusDomRef();

			// Assert
			cy.get("@getFocusDomRefSpy").should("have.been.calledOnce");
			expect(focusDomRef).to.not.be.null;
			expect(focusDomRef).to.be.instanceOf(HTMLElement);
			expect(focusDomRef).to.be.equal(fakeElement);

		});
	});
});
