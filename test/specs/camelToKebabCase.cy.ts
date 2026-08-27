import camelToKebabCase from "../../src/utils/camelToKebabCase.js";

describe("camelToKebabCase", () => {
	beforeEach(() => {
		// runs before each test in this block
	});

	describe("test methods", () => {
		it("tests camelToKebabCase", () => {
			const res = camelToKebabCase("testDummyString");
			expect(res).to.be.equal("test-dummy-string");
		});
	});
});
