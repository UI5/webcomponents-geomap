import Feature from "../../src/Feature.js";
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("Feature", () => {
	beforeEach(() => {
		// runs before each test in this block
		setWorkerUrl("dummy");
	});

	describe("test methods", () => {
		it("tests get type", () => {
			const f = new Feature({},{}, {});
			expect(f.type).to.equal("Feature");
		});

		it("tests get id", () => {
			const f = new Feature({},{}, {id: "dummy"});
			expect(f.id).to.equal("dummy");
		});

		it("tests get properties", () => {
			const f = new Feature({},{}, {properties: {foo: "bar"}});
			expect(f.properties).to.exist;
			expect(f.properties.foo).to.exist;
			expect(f.properties.foo).to.equal("bar");
		});

		it("tests get geometry", () => {
			const f = new Feature({},{}, {geometry: {type: "Point", coordinates: [0, 0]}});
			expect(f.geometry).to.exist;
			expect(f.geometry.type).to.exist;
			expect(f.geometry.type).to.equal("Point");
		});

		it("tests setState", () => {
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			map.setFeatureState = () => {};
			const spy = cy.spy(map, "setFeatureState");
			const f = new Feature(map,{}, {geometry: {type: "Point", coordinates: [0, 0]}});
			f.setState({});

			expect(spy.callCount).to.equal(1);
		});
	});
});
