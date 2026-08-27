import GeomapControlBase from "../../src/GeomapControlBase.js";
import Map from "../../src/extensions/Map";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("GeomapControlBase", () => {
	beforeEach(() => {
		// runs before each test in this block
		setWorkerUrl("dummy");
	});

	describe("test properties", () => {
		it("tests position", () => {
			window.customElements.define('my-custom-element', GeomapControlBase); // only the first time register the custom element
			const c = new GeomapControlBase();
			expect(c.position).to.equal("TopLeft");
		});
	});
	describe("test methods", () => {
		it("tests handleInvalidation", () => {
			const c = new GeomapControlBase();

			let r = c.handleInvalidation();
			expect(r).to.equal(undefined);

			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			var ctr = 0;
			c._instance = {};
			c.map = map;
			c.map.moveControl = () => {ctr++;};

			r = c.handleInvalidation({type: "property", name: "position"});
			expect(ctr).to.equal(1);
		});

		it("tests isGeoMapControl", () => {
			const c = new GeomapControlBase();
			const r = c.isGeoMapControl;
			expect(r).to.be.true;
		});

		it("tests effectivePosition", () => {
			const c = new GeomapControlBase();
			const r = c.effectivePosition;
			expect(r).to.equal("top-left");
		});

	});
});
