import GeomapNavigationControlComponent from "../../src/GeomapNavigationControlComponent.js";

describe("GeomapNavigationControlComponent", () => {
	beforeEach(() => {
		// runs before each test in this block
	});

	describe("test properties", () => {
		it("tests noCompass", () => {
			const p = new GeomapNavigationControlComponent();

			// Assert
			expect(p.noCompass).to.equal(false);
		});

		it("tests noZoom", () => {
			const p = new GeomapNavigationControlComponent();

			// Assert
			expect(p.noZoom).to.equal(false);
		});
	});
	describe("test methods", () => {
		it("tests _onZoomIn", () => {
			const p = new GeomapNavigationControlComponent();
			const spy = cy.spy();
			p.addEventListener("zoom-in", spy);
			const r = p._onZoomIn();

			// Assert
			expect(spy.callCount).to.equal(1);
		});

		it("tests _onZoomOut", () => {
			const p = new GeomapNavigationControlComponent();
			const spy = cy.spy();
			p.addEventListener("zoom-out", spy);
			const r = p._onZoomOut();

			// Assert
			expect(spy.callCount).to.equal(1);
		});

		it("tests _onCompassClick", () => {
			const p = new GeomapNavigationControlComponent();
			const spy = cy.spy();
			p.addEventListener("compass-click", spy);
			const r = p._onCompassClick();

			// Assert
			expect(spy.callCount).to.equal(1);
		});
	});
});
