import hexToRgb from "../../src/utils/hexToRgb.js";

describe("hexToRgb", () => {
	beforeEach(() => {
		// runs before each test in this block
	});

	describe("test methods", () => {
		it("tests hexToRgb", () => {
			const res = hexToRgb("0096FF");
			const exp = {
				r: 0,
				g: 150,
				b: 255
			};
			expect(res).to.deep.equal(exp);
		});

		it("tests hexToRgb with leading hash", () => {
			const res = hexToRgb("#0096FF");
			expect(res).to.deep.equal({
				r: 0,
				g: 150,
				b: 255
			});
		});

		it("tests hexToRgb returns null for invalid input", () => {
			expect(hexToRgb("not-a-hex")).to.equal(null);
			expect(hexToRgb("")).to.equal(null);
			expect(hexToRgb("12345")).to.equal(null);
			expect(hexToRgb("#12g456")).to.equal(null);
		});
	});
});
