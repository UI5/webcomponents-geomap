import GeomapShape from "../../src/GeomapShape.js";
import { Map } from "../../src/MapLibre.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("ui5-geomap-shape", () => {
	beforeEach(() => {
		// runs before each test in this block
		setWorkerUrl("dummy");
	});
    describe("test methods", () => {
        it("tests layerSource", () => {
            // Arrange
            window.customElements.define('my-custom-element', GeomapShape); // only the first time register the custom element

            const shape = new GeomapShape();
            const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            shape.map = map;

            cy.stub(map, "addSource");
            cy.stub(map, "getSource");

            // Act
            const id = shape.layerSource;

            // Assert
            expect(map.addSource.calledOnce).to.equal(true);
            expect(id).to.equal(shape._id);
        });
        it("tests handleInvalidation", () => {
            // Arrange
            const shape = new GeomapShape();
            const map = new Map({
                container: document.createElement("div"),
                attributionControl: false,
                zoom: 5
            });
            shape.map = map;
            const changeinfo = {};

            cy.stub(shape, "sourceUpdateNeeded").returns(true);
            cy.stub(shape, "updateSource");
            cy.stub(map, "getLayer").returns(true);

            // Act
            shape.handleInvalidation(changeinfo);

            // Assert
            expect(shape.sourceUpdateNeeded.calledOnce).to.equal(true);
            expect(shape.sourceUpdateNeeded.calledWith(changeinfo)).to.equal(true);
            expect(shape.updateSource.calledOnce).to.equal(true);
        });

        it("tests sourceUpdateNeeded", () => {
            // Arrange
            const shape = new GeomapShape();

            // Act
            const needed = shape.sourceUpdateNeeded({});

            // Assert
            expect(needed).to.equal(true);
        });

		it("tests updateSource", () => {
            // Arrange
            const shape = new GeomapShape();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			shape.map = map;
			let countGetSourceCalled = 0;
			let countSetDataCalled = 0;
			shape.map.getSource = () => {
				countGetSourceCalled++;
				return {
					setData: () => {
						countSetDataCalled++;
					}
				};
			};

            // Act
            const needed = shape.updateSource();

            // Assert
            expect(countGetSourceCalled).to.equal(1);
            expect(countSetDataCalled).to.equal(1);
        });
    });
});
