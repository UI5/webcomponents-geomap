import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapCopyrightControl.js";
import GeomapCopyrightControlWrapper from "../../src/extensions/controls/GeomapCopyrightControlWrapper.js";
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("GeomapCopyrightControlWrapper", () => {
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
			<ui5-geomap-copyright-control slot="mapControls" position="TopRight">
				<div class="copyright">
					Copyright
				</div>
			</ui5-geomap-copyright-control>
        </ui5-geomap>`).as("geomap");
	});

	describe("test methods", () => {
		it("tests onAdd", () => {
				// Arrange
				const copyrightControl = GeomapCopyrightControlWrapper;
				const wrapper = new copyrightControl({slotName: "dummyName"});

				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5
				});

				// Act
				wrapper.onAdd(map);

				// Assert
				expect(wrapper._slot.name).to.be.equal("dummyName");
				expect(wrapper._container.className).to.equal("maplibregl-ctrl");
		});

		it("tests onRemove", () => {
			// Arrange
			const copyrightControl = GeomapCopyrightControlWrapper;
			const wrapper = new copyrightControl({slotName: "dummyName"});

			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});

			// Act
			wrapper.onAdd(map);
			wrapper.onRemove();

			// Assert
			expect(wrapper._slot.name).to.be.equal("dummyName");
			expect(wrapper._map).to.equal(undefined);
		});

		it("tests onRemove", () => {
			// Arrange
			const copyrightControl = GeomapCopyrightControlWrapper;
			const wrapper = new copyrightControl({slotName: "dummyName"});

			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});

			// Act
			wrapper.onAdd(map);
			wrapper.setSlotName("dummyNameModified");

			// Assert
			expect(wrapper._slot.name).to.be.equal("dummyNameModified");
		});
	});
});
