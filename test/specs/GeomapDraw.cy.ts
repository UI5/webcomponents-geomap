import GeomapDraw from "../../src/utils/GeomapDraw.js";
import Map from "../../src/extensions/Map.js";
import { setWorkerUrl,} from "../../src/MapLibre.js";

describe("GeomapDraw", () => {
	beforeEach(() => {
		// runs before each test in this block
		setWorkerUrl("dummy");
	});

	describe("test methods", () => {
		it("tests GeomapDraw", () => {
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			const draw = new GeomapDraw(map, {});
			expect(draw).to.not.equal(null);

			draw.destroy();
			expect(draw.draw).to.equal(null);
		});
	});
});
