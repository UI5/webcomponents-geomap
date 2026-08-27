import { html } from "lit";
import "../../src/GeomapSpot.js";
import { Marker } from "../../src/MapLibre.js";

describe("ui5-geomap-spot", () => {
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

	describe("test properties", () => {
		it("tests icon property, BGSOFUISAKAR-1183", () => {
			cy.mount(html`<ui5-geomap-spot icon="myIcon"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["icon"]).to.equal("myIcon");

				// Act
				cy.log("Change icon to yourIcon");
				geospotDom.setAttribute("icon", "yourIcon");
			});

			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["icon"]).to.equal("yourIcon");
			});
		});

		it("tests width property, BGSOFUISAKAR-1183", () => {
			cy.mount(html`<ui5-geomap-spot width="3rem"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["width"]).to.equal("3rem");

				// Act
				cy.log("Change width to 4rem");
				geospotDom.setAttribute("width", "4rem");
			});

			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["width"]).to.equal("4rem");
			});
		});

		it("tests height property, BGSOFUISAKAR-1183", () => {
			cy.mount(html`<ui5-geomap-spot height="1rem"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["height"]).to.equal("1rem");

				// Act
				cy.log("Change height to 1.5rem");
				geospotDom.setAttribute("height", "1.5rem");
			});

			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["height"]).to.equal("1.5rem");
			});
		});

		it("tests opacity property, BGSOFUISAKAR-1183", () => {
			cy.mount(html`<ui5-geomap-spot opacity="0.8"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["opacity"]).to.equal("0.8");

				// Act
				cy.log("Change opacity to 0.6");
				geospotDom.setAttribute("opacity", "0.6");
			});

			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["opacity"]).to.equal("0.6");
			});
		});

		it("tests color property, BGSOFUISAKAR-1183", () => {
			cy.mount(html`<ui5-geomap-spot color="red"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["color"]).to.equal("red");

				// Act
				cy.log("Change color to blue");
				geospotDom.setAttribute("color", "blue");
			});

			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const state = geospotDom._state;

				// Assert
				expect(state["color"]).to.equal("blue");
			});
		});
	});
	describe("test methods", () => {
		it("tests createMarkerInstance method, BGSOFUISAKAR-1183", () => {
			cy.mount(html`<ui5-geomap-spot icon="testIcon" width="5rem" height="6rem" opacity="0.3" color="red" lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				cy.spy(geospotDom, "_updateAriaAttributes");

				// Act
				const marker = geospotDom.createMarkerInstance();
				const spotComponent = marker.getElement();

				// Assert
				expect(spotComponent.icon).to.equal("testIcon");
				// expect(spotComponent.draggable).to.equal(true);
				expect(spotComponent.width).to.equal("5rem");
				expect(spotComponent.height).to.equal("6rem");
				expect(spotComponent.opacity).to.equal('0.3');
				expect(spotComponent.color).to.equal("red");
				expect(spotComponent.lng).to.equal(11);
				expect(spotComponent.lat).to.equal(51);

				expect(geospotDom._updateAriaAttributes.called).to.equal(true);
			});
		});

		it("tests createMarkerInstance sets explicit dimensions on host element so MapLibre can calculate anchor offset before shadow DOM renders", () => {
			cy.mount(html`<ui5-geomap-spot width="3rem" height="4rem" lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);

				// Act
				const marker = geospotDom.createMarkerInstance();
				const spotComponent = marker.getElement();

				// Assert — dimensions must be set on the host element so MapLibre
				// can calculate the anchor offset before shadow DOM renders.
				expect(spotComponent.style.width).to.equal("3rem");
				expect(spotComponent.style.height).to.equal("4rem");
				expect(spotComponent.style.display).to.equal("block");
			});
		});

		it("tests createMarkerInstance enables subpixelPositioning for smooth rendering at fractional zoom levels", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);

				// Act
				const marker = geospotDom.createMarkerInstance();

				// Assert
				expect(marker._subpixelPositioning).to.equal(true);
			});
		});

		it("tests anchor property defaults to 'bottom' for correct marker positioning so the pin tip aligns with the geographic coordinate", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				const geospotDom = $geospot.get(0);
				expect(geospotDom.anchor).to.equal("bottom");
			});
		});

		it("tests updateMarkerInstance syncs style dimensions", () => {
			cy.mount(html`<ui5-geomap-spot width="2rem" height="2rem" lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const marker = geospotDom.createMarkerInstance();

				// Act
				geospotDom.width = "5rem";
				geospotDom.height = "6rem";
				geospotDom.updateMarkerInstance(marker);

				// Assert
				const spotComponent = marker.getElement();
				expect(spotComponent.style.width).to.equal("5rem");
				expect(spotComponent.style.height).to.equal("6rem");
			});
		});

		it("tests updateMarkerInstance method, BGSOFUISAKAR-1183", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const marker = new Marker();

				// Act
				geospotDom.updateMarkerInstance(marker);

				// Assert
				expect(marker.getLngLat().lng).to.equal(11);
				expect(marker.getLngLat().lat).to.equal(51);

			});
		});

		it("tests _updateAriaAttributes method, BGSOFUISAKAR-1183, BGSOFUISAKAR-1135", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const marker = new Marker();
				const element = marker.getElement();

				// Act
				geospotDom._updateAriaAttributes(element);

				// Assert
				expect(element.getAttribute("aria-label")).to.equal("Spot marker");
				expect(element.getAttribute("role")).to.equal("img");
			});
		});

		it("tests getFocusDomRef returns the MapLibre marker element so keyboard focus lands on the visible marker, BGSOFUISAKAR-1183, BGSOFUISAKAR-1135", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);

				// Act
				const focusDomRef = geospotDom.getFocusDomRef();

				// Assert
				expect(focusDomRef).to.not.be.null;
				expect(focusDomRef).to.be.instanceOf(HTMLElement);
			});
		});
	});

	describe("test events", () => {
		it("tests dragend event, BGSOFUISAKAR-1183", () => {
			cy.mount(html`
				<ui5-geomap-spot icon="testIcon" width="5rem" height="6rem" opacity="0.3" color="red" lng="11"
								 lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const marker = geospotDom.createMarkerInstance();
				marker.getLngLat = () => {
					return {lng: 15, lat: 55};
				}
				marker.fire("dragend");
				expect(geospotDom.lng).to.equal(15);
				expect(geospotDom.lat).to.equal(55);
			});
		});

		it("tests click event fires the public 'click' decorator event", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const marker = geospotDom.createMarkerInstance();
				const spotComponent = marker.getElement();
				let received = 0;
				geospotDom.addEventListener("click", () => { received++; });

				// Act
				spotComponent.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));

				// Assert
				expect(received).to.equal(1);
			});
		});

		it("tests right-click event fires the public 'right-click' decorator event", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const marker = geospotDom.createMarkerInstance();
				const spotComponent = marker.getElement();
				let received = 0;
				geospotDom.addEventListener("right-click", () => { received++; });

				// Act
				spotComponent.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true }));

				// Assert
				expect(received).to.equal(1);
			});
		});
	});

	describe("test handleInvalidation", () => {
		it("re-creates marker on anchor change while attached to a map", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				const fakeMap = {};
				geospotDom.map = fakeMap;
				const fakeMarker = {
					removed: false,
					addedTo: null,
					remove() { this.removed = true; },
					addTo(map) { this.addedTo = map; },
					getElement() { return document.createElement("div"); },
				};
				geospotDom._markerInstance = fakeMarker;
				let getMarkerCount = 0;
				Object.defineProperty(geospotDom, "markerInstance", {
					get() {
						getMarkerCount++;
						return fakeMarker;
					},
					configurable: true,
				});

				// Act
				geospotDom.handleInvalidation({ type: "property", name: "anchor" });

				// Assert
				expect(fakeMarker.removed).to.equal(true);
				expect(getMarkerCount).to.be.greaterThan(0);
				expect(fakeMarker.addedTo).to.equal(fakeMap);
			});
		});

		it("ignores unrelated invalidation calls", () => {
			cy.mount(html`<ui5-geomap-spot lng="11" lat="51"></ui5-geomap-spot>`).as("geomapspot");
			cy.get("@geomapspot").then(($geospot) => {
				// Arrange
				const geospotDom = $geospot.get(0);
				let removed = false;
				geospotDom._markerInstance = { remove() { removed = true; } };

				// Act
				geospotDom.handleInvalidation({ type: "slot", name: "anchor" });
				geospotDom.handleInvalidation({ type: "property", name: "lat" });

				// Assert - marker is left alone
				expect(removed).to.equal(false);
			});
		});
	});
});
