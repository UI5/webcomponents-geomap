import Map from "../../src/extensions/Map.js";
import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapNavigationControl.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("Map", () => {
	beforeEach(() => {
		cy.on('uncaught:exception', (err, runnable) => {
			return false;
		});
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

		cy.mount(html`<ui5-geomap>
            <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
        </ui5-geomap>`).as("geomap");
	});

	describe("test methods", () => {
		it("tests getHelperMarker, BGSOFUISAKAR-1134", () => {

			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});

			const marker = map.getHelperMarker("click");
			expect(marker._element).to.be.instanceOf(HTMLElement);
		});

		it("tests moveControl, BGSOFUISAKAR-1134", () => {
			cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
			</ui5-geomap>`).as("geomap");

			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5
				});

				const rcSpy = cy.spy(map, "removeControl");
				const acSpy = cy.spy(map, "addControl");

				const marker = map.moveControl(geoMapDom.controls[0], "top-left");
				expect(rcSpy.callCount).to.be.equal(1);
				expect(acSpy.callCount).to.be.equal(1);
			});


		});
	});
});
