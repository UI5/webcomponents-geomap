import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapScaleControl.js";

describe("ui5-geomap", () => {
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

		cy.mount(html`<ui5-geomap>
            <ui5-geomap-provider slot="mapControls" style-url="https://dummyUrl/styles/ArcGIS:Streets?type=style&token=test-key"></ui5-geomap-provider>
        </ui5-geomap>`).as("geomap");
	});

	describe("test properties", () => {

	});

	describe("test methods", () => {

		it("tests handleInvalidation method", () => {
			cy.mount(html`
				<ui5-geomap>
					<ui5-geomap-provider slot="mapControls" style-url="https://dummyUrl/styles/ArcGIS:Streets?type=style&token=test-key"></ui5-geomap-provider>
					<ui5-geomap-scale-control slot="mapControls" units="Imperial"
											  position="BottomRight"></ui5-geomap-scale-control>
				</ui5-geomap>`).as("geomap");

			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				// Assert
				expect(geoMapDom.controls).to.have.lengthOf(1);
				expect(geoMapDom.controls[0].getAttribute("position")).to.equal("BottomRight");

				// Act
				geoMapDom.controls[0].setAttribute("position", "TopLeft");
				const st = cy.stub(geoMapDom.controls[0], "handleInvalidation");
				geoMapDom.controls[0].handleInvalidation();
				// Assert
				expect(geoMapDom.controls[0].getAttribute("position")).to.equal("TopLeft");
				expect(st.callCount).to.equal(1);
			});
		});

		it("tests handleInvalidation method - additional", () => {
			cy.mount(html`
				<ui5-geomap>
					<ui5-geomap-provider slot="mapControls" style-url="https://dummyUrl/styles/ArcGIS:Streets?type=style&token=test-key"></ui5-geomap-provider>
					<ui5-geomap-scale-control slot="mapControls" units="Imperial"
											  position="BottomRight"></ui5-geomap-scale-control>
				</ui5-geomap>`).as("geomap");

			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				// Assert
				expect(geoMapDom.controls).to.have.lengthOf(1);
				expect(geoMapDom.controls[0].getAttribute("position")).to.equal("BottomRight");

				// Act
				geoMapDom.controls[0].setAttribute("position", "TopLeft");

				let r = geoMapDom.controls[0].handleInvalidation();
				expect(r).to.equal(undefined);

				let ctr = 0;
				geoMapDom.controls[0].map = geoMapDom.map;
				geoMapDom.controls[0]._instance.setUnit = () => {ctr++;};

				r = geoMapDom.controls[0].handleInvalidation({type: "property", name: "units"});
				expect(ctr).to.equal(1);

			});
		});
	});
})
