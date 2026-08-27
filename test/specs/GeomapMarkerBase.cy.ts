import GeomapMarkerBase from "../../src/GeomapMarkerBase.js";
import { Marker } from "../../src/MapLibre.js";
import Map from "../../src/extensions/Map";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("GeomapMarkerBase", () => {
	beforeEach(() => {
		// runs before each test in this block
		setWorkerUrl("dummy");
	});
    describe("test properties", () => {
        it("tests default properties", () => {
            // Arrange
            window.customElements.define('my-custom-element', GeomapMarkerBase); // only the first time register the custom element
			const c = new GeomapMarkerBase();

            // Assert
            expect(c.lng).to.equal(0);
            expect(c.lat).to.equal(0);
        });

    });
    describe("test methods", () => {
        it("tests markerInstance property", () => {
            // Arrange
			const c = new GeomapMarkerBase();
            cy.spy(c, "createMarkerInstance");

            // Act
            c.markerInstance;

            // Assert
            expect(c.createMarkerInstance.calledOnce).to.equal(true);
        });

        it("tests onBeforeRendering property", () => {
            // Arrange
			const c = new GeomapMarkerBase();
            cy.spy(c, "updateMarkerInstance");

            // Act
            c.onBeforeRendering();

            // Assert
            expect(c.updateMarkerInstance.calledOnce).to.equal(true);
        });

        it("tests updateMarkerInstance property", () => {
            // Arrange
			const c = new GeomapMarkerBase();
            const marker =  new Marker();

            // Act
            c.updateMarkerInstance(marker);

            // Assert
            expect(c.marker).to.equal(marker);
        });

		it("tests onEnterDOM method", () => {
			// Arrange
			const c = new GeomapMarkerBase();

			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			c.map = map;
			c.whenMapConnected = () => {
				return new Promise((resolve) => {
					resolve("done");
				});
			};
			let countCalled = 0;
			c._markerInstance = {
				addTo: () => {
					countCalled++;
				}
			}

			// Act
			c.onEnterDOM().then(() => {

				// Assert
				expect(countCalled).to.equal(1);
			});

		});

		it("tests onExitDOM method", () => {
			// Arrange
			const c = new GeomapMarkerBase();

			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			c.map = map;
			let countCalled = 0;
			c._markerInstance = {
				remove: () => {
					countCalled++;
				}
			}

			// Act
			c.onExitDOM();

			// Assert
			expect(countCalled).to.equal(1);
			expect(c._markerInstance).to.equal(null);

		});
    });
});
