import GeomapElement from "../../src/GeomapElement.js";
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";
import {
	TerraDraw,
	TerraDrawSelectMode,
} from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";


describe("ui5-geomap-element", () => {
	beforeEach(() => {
		// runs before each test in this block
		setWorkerUrl("dummy");
	});
    describe("test methods", () => {
        it("tests onExitDOM method", () => {
            // Arrange
            const element = GeomapElement;
            cy.spy(element.prototype, "disconnectFromMap");

            // Act
            element.prototype.onExitDOM();

            // Assert
            expect(element.prototype.disconnectFromMap.called).to.equal(true);
        });

        it("tests connectToMap method", () => {
            // Arrange
            const element = GeomapElement;
            const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            cy.stub(element.prototype._whenMapConnectedPromise, "_deferredResolve");

            // Act
            element.prototype.connectToMap(map);

            // Assert
            expect(element.prototype.map).to.equal(map);
            expect(element.prototype._whenMapConnectedPromise._deferredResolve.calledOnce).to.equal(true);

            // Act
            const result = element.prototype.connectToMap(map);

            // Assert
            expect(result).to.equal(undefined);
            expect(element.prototype._whenMapConnectedPromise._deferredResolve.calledOnce).to.equal(true); // _deferredResolve is not called again

        });

		it("tests connectToDraw method", () => {
            // Arrange
            const element = GeomapElement;
            const draw = {
				_ui5GeomapPromise: Promise.resolve(),
				myDrawProp: "test"
			};

            // Act
            element.prototype.connectToDraw(draw);

            // Assert
            expect(element.prototype.draw).to.equal(draw);
        });

		it("tests connectToDraw early-returns when already connected to a TerraDraw", () => {
			// Arrange - swap a real TerraDraw onto the prototype so the instanceof guard fires.
			// secondDraw never gets read on the early-return path, so a placeholder is enough.
			const element = GeomapElement;
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5,
			});
			const firstDraw = new TerraDraw({
				adapter: new TerraDrawMapLibreGLAdapter({ map }),
				modes: [new TerraDrawSelectMode()],
			});
			const secondDraw = { _ui5GeomapPromise: Promise.resolve(), marker: "second" };
			const previousDraw = element.prototype.draw;
			element.prototype.draw = firstDraw;

			try {
				// Act
				element.prototype.connectToDraw(secondDraw);

				// Assert - first wins, second call short-circuits via the instanceof guard
				expect(element.prototype.draw).to.equal(firstDraw);
			} finally {
				element.prototype.draw = previousDraw;
			}
		});

    });
});
