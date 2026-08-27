import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapNavigationControl.js";
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("Map", () => {
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

		cy.mount(html`<ui5-geomap>
            <ui5-geomap-provider slot="mapControls" style-url="https://dummyUrl/styles/ArcGIS:Streets?type=style&token=test-key"></ui5-geomap-provider>
        </ui5-geomap>`).as("geomap");
	});

	describe("test methods", () => {

		it("tests handleInvalidation", () => {
			cy.mount(html`
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
			`).as("navigationControl");

			cy.get("@navigationControl").then(($navigationControl) => {
				// Arrange
				const navCtrlDom = $navigationControl.get(0);
				let r = navCtrlDom.handleInvalidation();
				expect(r).to.equal(undefined);

				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5
				});
				var ctr = 0;
				navCtrlDom.map = map;
				navCtrlDom._instance.setNoZoom = () => {ctr++;};
				navCtrlDom._instance.setNoCompass = () => {ctr++;};

				r = navCtrlDom.handleInvalidation({type: "property", name: "noCompass"});
				expect(ctr).to.equal(1);

				r = navCtrlDom.handleInvalidation({type: "property", name: "noZoom"});
				expect(ctr).to.equal(2);
			});


		});
	});
});
