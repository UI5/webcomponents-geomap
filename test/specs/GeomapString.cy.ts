import GeomapString from "../../src/converters/GeomapString.js";

describe("GeomapString", () => {
	beforeEach(() => {
		cy.intercept("GET", "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/*", {
			fixture: "ArcGIS_Streets.json",
			log: false
		}).as("style");
		cy.intercept("GET", "https://basemaps-api.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer?*", {
			fixture: "VectorTileServer.json",
			log: false
		}).as("vectorTileServer");
		cy.intercept("GET", /VectorTileServer\/tile.*$/, {
			body: "mocked",
			log: false
		}).as("vectorTileServer/pbfs");
		cy.intercept("GET", "https://cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/sprites/sprite.json?*", {
			fixture: "sprite.json",
			log: false
		}).as("sprite.json");
		cy.intercept("GET", "https://cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/sprites/sprite.png?*", {
			fixture: "sprite.png",
			log: false
		}).as("sprite.png");
		cy.intercept("GET", "https://cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/sprites/sprite@2x.json?*", {
			fixture: "sprite.json",
			log: false
		}).as("sprite@2x.json");
		cy.intercept("GET", "https://cdn.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/resources/sprites/sprite@2x.png?*", {
			fixture: "sprite.png",
			log: false
		}).as("sprite@2x.png");
	});
	describe("test methods", () => {
		it("tests toAttribute method, BGSOFUISAKAR-1029", () => {
			// Arrange
			const converter = GeomapString;

			// Act
			let result = converter.toAttribute();

			// Assert
			expect(result).to.equal(undefined);

			// Act
			result = converter.toAttribute("5");

			// Assert
			expect(result).to.equal("5");

			// Act
			result = converter.toAttribute("0");

			// Assert
			expect(result).to.equal("0");

			// Act
			result = converter.toAttribute([0, 1]);

			// Assert
			expect(result).to.equal(JSON.stringify([0,1]));
		});

		it("tests fromAttribute method, BGSOFUISAKAR-1029", () => {
			// Arrange
			const converter = GeomapString;

			// Act
			let result = converter.fromAttribute("stringDummy");

			// Assert
			expect(result).to.equal("stringDummy");

			// Act
			const temp = '3{"dummy": [{"fill-color": "red"]","message": "This is a test"}]}';
			result = converter.fromAttribute(temp);

			// Assert
			expect(result).to.equal(temp);
		});

	});
});
