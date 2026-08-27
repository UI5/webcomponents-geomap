import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapSelectionControl.js";
import GeomapSelectionControlWrapper from "../../src/extensions/controls/GeomapSelectionControlWrapper.js";
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
            <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
			<ui5-geomap-selection-control slot="mapControls" position="TopRight">
			</ui5-geomap-selection-control>
        </ui5-geomap>`).as("geomap");
	});

	describe("test methods", () => {
		it("tests onAdd", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const selectionControl = GeomapSelectionControlWrapper;
				const options = {
					selectionFinishCallback: () => {},
					selectionItemCallback: () => {},
					selectionType: "freehand",
					width: "10px",
					fillColor: "#FF0000",
					fillOpacity: "1",
					outlineColor: "#000000"
				}
				const wrapper = new selectionControl(options);

				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5
				});

				// Act
				wrapper.onAdd(map);

				// Assert
				expect(wrapper._container.className).to.equal("maplibregl-ctrl");
				expect(wrapper._container.getAttribute("selection-type")).to.equal("freehand");
			});
		});

		it("tests setModeStyles", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const selectionControl = GeomapSelectionControlWrapper;
				const options = {
					selectionFinishCallback: () => {},
					selectionItemCallback: () => {},
					selectionType: "freehand",
					width: "10px",
					fillColor: "#FF0000",
					fillOpacity: "1",
					outlineColor: "#000000"
				}
				const wrapper = new selectionControl(options);

				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5
				});

				// Act
				wrapper.onAdd(map);
				const r = wrapper.setModeStyles("polygon", options);

				// Assert
				expect(r).to.be.equal(undefined);

				// Arrange
				let countCall = 0;
				wrapper._container._terraDraw = {
					setModeStyles: () => {
						countCall++;
					}
				};

				// Act
				wrapper.setModeStyles("polygon", options);

				// Assert
				expect(countCall).to.be.equal(1);
			});
		});
	});
});
