import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapNavigationControl.js";
import GeomapNavigationControlWrapper from "../../src/extensions/controls/GeomapNavigationControlWrapper.js";
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("GeomapNavigationControlWrapper", () => {
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
			<ui5-geomap-navigation-control slot="mapControls" position="TopRight"></ui5-geomap-navigation-control>
        </ui5-geomap>`).as("geomap");
	});

	describe("test methods", () => {
		it("tests onAdd", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const navigationControlWrapper = GeomapNavigationControlWrapper;
				const wrapper = new navigationControlWrapper({
					noCompass: false,
					noZoom: false,
					visualizePitch: true,
				});
				const spyRotate = cy.spy(wrapper, "_rotateCompassArrow");
				addEventListener("pitch", spyRotate);
				addEventListener("rotate", spyRotate);

				wrapper.onAdd(geoMapDom.map);

				geoMapDom.map.setPitch(1);
				geoMapDom.map.rotateTo(1);

				expect(wrapper._map).to.exist;
				expect(wrapper._container.className).to.be.equal("maplibregl-ctrl");
				expect(spyRotate.callCount).to.be.equal(2);

			});
		});

		it("tests onAdd mocked", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const navigationControlWrapper = GeomapNavigationControlWrapper;
				const wrapper = new navigationControlWrapper({
					noCompass: true,
					noZoom: true,
					visualizePitch: true,
				});
				const spyRotate = cy.spy(wrapper, "_rotateCompassArrow");
				addEventListener("pitch", spyRotate);
				addEventListener("rotate", spyRotate);

				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5
				});
				map.resetNorthPitch = () => {};
				map.resetNorth = () => {};

				const spyZI = cy.spy(map, "zoomIn");
				const spyZO = cy.spy(map, "zoomOut");
				const spyRNP = cy.spy(map, "resetNorthPitch");
				const spyRN = cy.spy(map, "resetNorth");

				wrapper.onAdd(map);

				wrapper._container.fireDecoratorEvent("zoom-in");
				wrapper._container.fireDecoratorEvent("zoom-out");
				wrapper._container.fireDecoratorEvent("compass-click");

				expect(wrapper._map).to.exist;
				expect(wrapper._container.getAttribute("no-zoom")).to.be.equal("");
				expect(wrapper._container.getAttribute("no-compass")).to.be.equal("");
				expect(spyZI.callCount).to.be.equal(1);
				expect(spyZO.callCount).to.be.equal(1);
				expect(spyRNP.callCount).to.be.equal(1);
				expect(spyRN.callCount).to.be.equal(0);

			});
		});

		it("tests onRemove", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const navigationControlWrapper = GeomapNavigationControlWrapper;
				const wrapper = new navigationControlWrapper({
					noCompass: false,
					noZoom: false,
					visualizePitch: true,
				});

				wrapper.onAdd(geoMapDom.map);

				wrapper.onRemove();

				expect(wrapper._map).to.be.equal(undefined);
			});
		});

		it("tests setNoZoom", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const navigationControlWrapper = GeomapNavigationControlWrapper;
				const wrapper = new navigationControlWrapper({
					noCompass: false,
					noZoom: false,
					visualizePitch: true,
				});

				wrapper.onAdd(geoMapDom.map);
				wrapper.setNoZoom(true);

				expect(wrapper._container.getAttribute("no-zoom")).to.be.equal('');

				wrapper.setNoZoom(false);
				expect(wrapper._container.getAttribute("no-zoom")).to.be.equal(null)
			});
		});

		it("tests setNoCompass", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const navigationControlWrapper = GeomapNavigationControlWrapper;
				const wrapper = new navigationControlWrapper({
					noCompass: false,
					noZoom: false,
					visualizePitch: true,
				});

				wrapper.onAdd(geoMapDom.map);
				wrapper.setNoCompass(true);

				expect(wrapper._container.getAttribute("no-compass")).to.be.equal('');


				wrapper.setNoCompass(false);
				expect(wrapper._container.getAttribute("no-compass")).to.be.equal(null)
			});
		});

		it("tests _rotateCompassArrow", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const navigationControlWrapper = GeomapNavigationControlWrapper;
				const wrapper = new navigationControlWrapper({
					noCompass: false,
					noZoom: false,
					visualizePitch: true,
				});

				wrapper.onAdd(geoMapDom.map);
				const b = wrapper._rotateCompassArrow();

				expect(b).to.equal(undefined);
			});
		});
	});
});
