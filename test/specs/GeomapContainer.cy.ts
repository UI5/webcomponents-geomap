import { html } from "lit";
import "../../src/GeomapContainer.js";
import Map from "../../src/extensions/Map.js";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("ui5-geomap-container", () => {
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

    describe("test methods", () => {
        it("tests createMarkerInstance method", () => {
            cy.mount(html`	<ui5-geomap-container lat="51.00" lng="8.6">
                <div class="circle" style="background: red; width: 50px; height: 50px;">15%</div>
            </ui5-geomap-container>`).as("geomapcontainer");


			cy.get("@geomapcontainer").then(($geocontainer) => {
				// Arrange
				const geocontainer = $geocontainer.get(0);

				// Act
				const marker = geocontainer.createMarkerInstance();

				// Assert
				expect(marker._draggable).to.equal(false);
				expect(marker.getLngLat().lng).to.equal(8.6);
				expect(marker.getLngLat().lat).to.equal(51);
				expect(marker.getElement().innerHTML).to.equal('<slot name=""></slot>');
			});
		});

		it("tests createMarkerInstance enables subpixelPositioning for smooth rendering at fractional zoom levels", () => {
			cy.mount(html`<ui5-geomap-container lat="51.00" lng="8.6">
				<div style="width: 50px; height: 50px;">content</div>
			</ui5-geomap-container>`).as("geomapcontainer");

			cy.get("@geomapcontainer").then(($geocontainer) => {
				// Arrange
				const geocontainer = $geocontainer.get(0);

				// Act
				const marker = geocontainer.createMarkerInstance();

				// Assert
				expect(marker._subpixelPositioning).to.equal(true);
			});
		});

		it("tests anchor property defaults to 'bottom-left' so container content sits above and to the right of the pin point", () => {
			cy.mount(html`<ui5-geomap-container lat="51.00" lng="8.6">
				<div style="width: 50px; height: 50px;">content</div>
			</ui5-geomap-container>`).as("geomapcontainer");

			cy.get("@geomapcontainer").then(($geocontainer) => {
				const geocontainer = $geocontainer.get(0);
				expect(geocontainer.anchor).to.equal("bottom-left");
			});
		});

		it("tests updateMarkerInstance method", () => {
			cy.mount(html`	<ui5-geomap-container lat="51.00" lng="8.6">
				<div class="circle" style="background: red; width: 50px; height: 50px;">15%</div>
			</ui5-geomap-container>`).as("geomapcontainer");


			cy.get("@geomapcontainer").then(($geocontainer) => {
				// Arrange
				const geocontainer = $geocontainer.get(0);
				const marker = geocontainer.createMarkerInstance();

				// Act
				geocontainer.lat = 50;
				geocontainer.lng = 9.5;

				geocontainer.updateMarkerInstance(marker);

				// Assert
				expect(marker.getLngLat().lng).to.equal(9.5);
				expect(marker.getLngLat().lat).to.equal(50);
			});

		});

		it("tests connectToMap method", () => {
			cy.mount(html`	<ui5-geomap-container lat="51.00" lng="8.6">
				<div class="circle" style="background: red; width: 50px; height: 50px;">15%</div>
			</ui5-geomap-container>`).as("geomapcontainer");


			cy.get("@geomapcontainer").then(($geocontainer) => {
				// Arrange
				const geocontainer = $geocontainer.get(0);
				geocontainer._individualSlot = "myIndividualSlot";
				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5
				});

				// Act
				geocontainer.connectToMap(map);

				// Assert
				expect(geocontainer._markerInstance.getElement().querySelector("slot").name).to.equal("myIndividualSlot");
			});

		});
		it("tests getFocusDomRef method", () => {
			cy.mount(html`<ui5-geomap-container lat="51.00" lng="8.6">
				<div class="circle" style="background: red; width: 50px; height: 50px;">15%</div>
			</ui5-geomap-container>`)
				.as("geomapcontainer");

			cy.get("@geomapcontainer").then(($geocontainer) => {
				// Arrange
				const geocontainer = $geocontainer.get(0);
				cy.spy(geocontainer, "getFocusDomRef").as("getFocusDomRefSpy");

				// Act
				const focusDomRef = geocontainer.getFocusDomRef();

				// Assert
				cy.get("@getFocusDomRefSpy")
				.should("have.been.calledOnce");
				expect(focusDomRef).to.not.be.null;
				expect(focusDomRef).to.be.instanceOf(HTMLElement);
				expect(focusDomRef.outerHTML).to.equal('<div class="maplibregl-marker maplibregl-marker-anchor-bottom-left"><slot name=""></slot></div>');
			});
		});

		it("tests handleInvalidation re-creates marker on anchor change", () => {
			cy.mount(html`<ui5-geomap-container lat="51.00" lng="8.6">
				<div style="width: 50px; height: 50px;">content</div>
			</ui5-geomap-container>`).as("geomapcontainer");

			cy.get("@geomapcontainer").then(($geocontainer) => {
				// Arrange
				const geocontainer = $geocontainer.get(0);
				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5,
				});
				geocontainer.connectToMap(map);
				const originalMarker = geocontainer._markerInstance;
				expect(originalMarker).to.not.be.null;
				cy.spy(originalMarker, "remove").as("removeSpy");

				// Act - anchor change should drop the marker so the next access re-creates it
				geocontainer.handleInvalidation({ type: "property", name: "anchor" });

				// Assert
				cy.get("@removeSpy").should("have.been.calledOnce");
				cy.wrap(geocontainer._markerInstance).should("not.equal", originalMarker);
			});
		});

		it("tests handleInvalidation ignores unrelated changes", () => {
			cy.mount(html`<ui5-geomap-container lat="51.00" lng="8.6">
				<div style="width: 50px; height: 50px;">content</div>
			</ui5-geomap-container>`).as("geomapcontainer");

			cy.get("@geomapcontainer").then(($geocontainer) => {
				// Arrange
				const geocontainer = $geocontainer.get(0);
				const map = new Map({
					container: document.createElement("div"),
					attributionControl: false,
					zoom: 5,
				});
				geocontainer.connectToMap(map);
				const originalMarker = geocontainer._markerInstance;

				// Act
				geocontainer.handleInvalidation({ type: "property", name: "lat" });
				geocontainer.handleInvalidation({ type: "slot", name: "anchor" });

				// Assert - marker untouched for unrelated property/type changes
				expect(geocontainer._markerInstance).to.equal(originalMarker);
			});
		});

		it("tests handleInvalidation is a no-op when there is no marker yet", () => {
			cy.mount(html`<ui5-geomap-container lat="51.00" lng="8.6">
				<div style="width: 50px; height: 50px;">content</div>
			</ui5-geomap-container>`).as("geomapcontainer");

			cy.get("@geomapcontainer").then(($geocontainer) => {
				// Arrange
				const geocontainer = $geocontainer.get(0);
				geocontainer._markerInstance = null;

				// Act + Assert (should not throw)
				geocontainer.handleInvalidation({ type: "property", name: "anchor" });
				expect(geocontainer._markerInstance).to.equal(null);
			});
		});
	});
});
