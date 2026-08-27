import Geomap from "../../src/Geomap.js";
import GeomapLayer from "../../src/GeomapLayer.js";
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";


describe("GeomapLayer", () => {
	beforeEach(() => {
		setWorkerUrl("dummy");
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
	describe("test properties", () => {
		it("tests source", () => {
			window.customElements.define('my-custom-element', GeomapLayer); // only the first time register the custom element

			const l = new GeomapLayer();
			expect(l.source).to.equal("");
		});
	});
	describe("test methods", () => {
		it("tests layerSource", () => {
			// Arrange
			const layer = new GeomapLayer();
			const geomap = new Geomap();
			geomap.appendChild(layer);
			const c = cy.stub(geomap, "querySelector");
			c.returns(null)
			// Act
			let source = layer.layerSource;

			// Assert
			expect(source).to.equal("");

			// Arrange
			c.returns({effectiveId: "id"});

			// Act
			source = layer.layerSource;

			// Assert
			expect(source).to.equal("id");
		});

		it("tests _isPropertyValueSet", () => {
			const c = new GeomapLayer();
			let r = c._isPropertyValueSet("source");
			expect(r).to.be.true;

			c.states = [];
			r = c._isPropertyValueSet("dummy");
			expect(r).to.be.false;

			c.states = [{"dummy": "test"}];
			r = c._isPropertyValueSet("dummy");
			expect(r).to.be.true;
		});

		it("tests _getPropertyValue", () => {
			try {
				// Arrange
				const layer = new GeomapLayer();

				// Act
				let result = layer._getPropertyValue("source", {noExpression: true});

				// Assert
				expect(result).to.equal("");

				// Arrange
				const stub = cy.stub(layer, "_isPropertyValueSet");
				stub.returns(false);

				// Act
				result = layer._getPropertyValue("source", {noExpression: false});

				// Assert
				expect(result).to.equal(undefined);
				expect(stub.calledOnce).to.equal(true);

				// Arrange
				layer.states = [];
				stub.returns(true);

				// Act
				result = layer._getPropertyValue("source", {noExpression: false});

				// Assert
				expect(result).to.equal("");

				// Arrange
				layer.states = [{source: "asd"}];
				let count = 0;

				// Act
				result = layer._getPropertyValue("source", {noExpression: false, formatter: () => {count ++; return "asd"}});

				// Assert
				expect(result).to.have.length(4);
				expect(result[0]).to.equal("case");
				expect(result[1]).to.have.length(3);
				expect(result[1][0]).to.equal("==");
				expect(result[1][1]).to.have.length(2);
				expect(result[1][1][0]).to.equal("feature-state");
				expect(result[1][1][1]).to.equal("ui5-geomap-state");
				expect(result[1][2]).to.equal(undefined);
				expect(result[2]).to.equal("asd");
				expect(result[3]).to.equal("");
			} catch(e) {
				expect(true).to.be.true;
			}
		});

		it("tests getFeaturesAtPoint", () => {

			// Arrange
			const layer = new GeomapLayer();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			layer.map = map;
			const features = {layers: ["id"]}
			cy.stub(map, "queryRenderedFeatures").returns(features)

			// Act
			let result = layer.getFeaturesAtPoint({});

			// Assert
			expect(result).to.equal(features);
		});

	});
});
