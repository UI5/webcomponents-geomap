import GeomapProviderBase from "../../src/GeomapProviderBase.js";

describe("GeomapProviderBase", () => {
	beforeEach(() => {
		// runs before each test in this block
	});

	describe("test methods", () => {
		it("tests transformRequest, BGSOFUISAKAR-1248, BGSOFUISAKAR-1247", () => {
			const p = new GeomapProviderBase();
			const r = p.transformRequest("dummy");
			expect(r.url).to.exist;
			expect(r.url).to.equal("dummy");
		});

		it("tests isValidConfiguration, BGSOFUISAKAR-1248, BGSOFUISAKAR-1247", () => {
			const p = new GeomapProviderBase();
			const r = p.isValidConfiguration();
			expect(r).to.be.false;
		});

		it("tests isValidHttpUrl, BGSOFUISAKAR-1248, BGSOFUISAKAR-1247", () => {
			const p = new GeomapProviderBase();
			let r = p.isValidHttpUrl("dummy");
			expect(r).to.be.false;
			r = p.isValidHttpUrl("http://dummy");
			expect(r).to.be.true;
		});

		it("tests getStyle, BGSOFUISAKAR-1248, BGSOFUISAKAR-1247", () => {
			const p = new GeomapProviderBase();
			const r = p.getStyle();
			expect(r).to.equal(undefined);
		});
	});
});
