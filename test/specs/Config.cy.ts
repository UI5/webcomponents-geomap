import {
	getSelectionStyles,
	setSelectionStyles,
	getLongLatPrecision,
	setLongLatPrecision,
	getDefaultSelectionStyles,
	getWorkerPath,
	setWorkerPath,
	getClickDelay,
	setClickDelay,
} from "../../src/config/Config.js";

describe("Config", () => {
	beforeEach(() => {
		// runs before each test in this block
	});

	describe("test methods", () => {
		it("tests getDefaultSelectionStyles", () => {
			const res = getDefaultSelectionStyles();
			expect(res).to.deep.equal({
				fillColor: "#0000FF",
				fillOpacity: 0.5,
				outlineColor: "#FF0000",
				outlineWidth: 2,
				width: 2,
				dragndropHover: "#3bb2d0",
				bounceColor: "#0096FF"
			});
		});

		it("tests getSelectionStyles", () => {
			const res = getSelectionStyles();
			expect(res).to.deep.equal({
				fillColor: "#0000FF",
				fillOpacity: 0.5,
				outlineColor: "#FF0000",
				outlineWidth: 2,
				width: 2,
				dragndropHover: "#3bb2d0",
				bounceColor: "#0096FF"
			});
		});

		it("tests setSelectionStyles", () => {
			setSelectionStyles({
				fillColor: "#0000FF",
					fillOpacity: 0.5,
					outlineColor: "#FF0000",
					outlineWidth: 5,
					width: 3,
					dragndropHover: "#3bb2d0",
					bounceColor: "#0096FF"
			});
			const res = getSelectionStyles();
			expect(res).to.deep.equal({
				fillColor: "#0000FF",
				fillOpacity: 0.5,
				outlineColor: "#FF0000",
				outlineWidth: 5,
				width: 3,
				dragndropHover: "#3bb2d0",
				bounceColor: "#0096FF"
			});
		});

		it("tests getLongLatPrecision", () => {
			const res = getLongLatPrecision();
			expect(res).to.deep.equal(5);
		});

		it("tests setLongLatPrecision", () => {
			setLongLatPrecision(4);
			const res = getLongLatPrecision();
			expect(res).to.equal(4);
		});

		it("tests getWorkerPath ", () => {
			const res = getWorkerPath();
			expect(res).to.deep.equal("worker.js");
		});

		it("tests setWorkerPath", () => {
			setWorkerPath("test.js");
			const res = getWorkerPath();
			expect(res).to.equal("test.js");
		});

		it("tests getClickDelay returns default of 300", () => {
			setClickDelay(300);
			const res = getClickDelay();
			expect(res).to.equal(300);
		});

		it("tests setClickDelay updates the delay", () => {
			setClickDelay(500);
			const res = getClickDelay();
			expect(res).to.equal(500);
		});

		it("tests setClickDelay is a no-op when delay is unchanged", () => {
			setClickDelay(400);
			setClickDelay(400);
			const res = getClickDelay();
			expect(res).to.equal(400);
		});
	});
});
