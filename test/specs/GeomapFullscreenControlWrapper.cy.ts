import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapFullscreenControl.js";
import GeomapFullscreenControlWrapper from "../../src/extensions/controls/GeomapFullscreenControlWrapper.js";

describe("GeomapFullscreenControlWrapper", () => {
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
			<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
        </ui5-geomap>`).as("geomap");
	});

	describe("test methods", () => {
		it("tests _setupUI, BGSOFUISAKAR-1136", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const fullscreenControlWrapper = GeomapFullscreenControlWrapper;
				const wrapper = new fullscreenControlWrapper({container: geoMapDom});

				wrapper._controlContainer = document.createElement("div");
				wrapper._onClickFullscreen = () => {};
				wrapper._changeIcon = () => {};

				const spyUpdateTitle = cy.spy(wrapper, "_updateTitle");
				const stubGetTitle = cy.stub(wrapper, "_getTitle").returns("Enter fullscreen");

				// Act
				wrapper._setupUI();

				// Assert
				expect(wrapper._fullscreenButton.className).to.be.equal("maplibregl-ctrl-fullscreen");
				expect(wrapper._fullscreenButton.getAttribute("accessible-name")).to.be.equal("Enter fullscreen");
				expect(wrapper._fullscreenButton.getAttribute("tooltip")).to.be.equal("Enter fullscreen");
				expect(spyUpdateTitle.callCount).to.equal(1);
				expect(stubGetTitle.callCount).to.equal(1);
			});
		});

		it("tests _updateTitle, BGSOFUISAKAR-1136", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const fullscreenControlWrapper = GeomapFullscreenControlWrapper;
				const wrapper = new fullscreenControlWrapper({container: geoMapDom});

				wrapper._controlContainer = document.createElement("div");
				wrapper._onClickFullscreen = () => {};
				wrapper._changeIcon = () => {};

				const stubGetTitle = cy.stub(wrapper, "_getTitle").returns("Enter fullscreen");

				// Act
				wrapper._setupUI();
				wrapper._updateTitle();

				// Assert
				expect(wrapper._fullscreenButton.className).to.be.equal("maplibregl-ctrl-fullscreen");
				expect(wrapper._fullscreenButton.getAttribute("accessible-name")).to.be.equal("Enter fullscreen");
				expect(wrapper._fullscreenButton.getAttribute("tooltip")).to.be.equal("Enter fullscreen");
			});
		});

		it("tests _changeIcon - BLI: BGOSFUISAKAR-1136", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const fullscreenControlWrapper = GeomapFullscreenControlWrapper;
				const wrapper = new fullscreenControlWrapper({container: geoMapDom});
				const cI = wrapper._changeIcon;

				wrapper._controlContainer = document.createElement("div");
				wrapper._onClickFullscreen = () => {};
				wrapper._changeIcon = () => {};

				const stubGetTitle = cy.stub(wrapper, "_getTitle").returns("Enter fullscreen");

				// Act
				wrapper._setupUI();
				wrapper._fullscreenButton.setAttribute("icon", "exit-full-screen");
				wrapper._changeIcon();

				// Assert
				expect(wrapper._fullscreenButton.className).to.be.equal("maplibregl-ctrl-fullscreen");
				expect(wrapper._fullscreenButton.getAttribute("icon")).to.be.equal("exit-full-screen");

				// Arrange
				wrapper._changeIcon = cI;
				let gC = 0, gS = 0;
				wrapper._fullscreenButton.getAttribute = () => {
					gC++;
					return "exit-full-screen";
				};
				wrapper._fullscreenButton.setAttribute = () => {
					gS++;
				};

				// Act
				wrapper._changeIcon();

				// Assert
				expect(gC).to.be.equal(1);
				expect(gS).to.be.equal(1);
			});
		});

		it("tests _requestFullscreen on iPhone - uses pseudo-fullscreen", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);
				const wrapper = new GeomapFullscreenControlWrapper({ container: geoMapDom });

				wrapper._controlContainer = document.createElement("div");
				wrapper._onClickFullscreen = () => {};
				wrapper._changeIcon = () => {};

				// Stub navigator.userAgent to simulate iPhone
				const originalUserAgent = navigator.userAgent;
				Object.defineProperty(navigator, "userAgent", {
					value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
					configurable: true
				});

				const spyTogglePseudoFullScreen = cy.stub(wrapper, "_togglePseudoFullScreen");

				// Act
				wrapper._requestFullscreen();

				// Assert
				expect(spyTogglePseudoFullScreen.callCount).to.equal(1);

				// Restore
				Object.defineProperty(navigator, "userAgent", {
					value: originalUserAgent,
					configurable: true
				});
			});
		});

		it("tests _requestFullscreen on non-iPhone - calls super method", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);
				const wrapper = new GeomapFullscreenControlWrapper({ container: geoMapDom });

				wrapper._controlContainer = document.createElement("div");
				wrapper._onClickFullscreen = () => {};
				wrapper._changeIcon = () => {};
				wrapper._map = { resize: () => {} };

				// Ensure we're not on iPhone (default test environment)
				const isIPhone = /iPhone/i.test(navigator.userAgent);

				const spyTogglePseudoFullScreen = cy.stub(wrapper, "_togglePseudoFullScreen");

				// Act
				wrapper._requestFullscreen();

				// Assert - on non-iPhone, _togglePseudoFullScreen should NOT be called directly
				// (it may be called by super if fullscreen API fails, but not by our override)
				if (!isIPhone) {
					expect(spyTogglePseudoFullScreen.callCount).to.equal(0);
				}
			});
		});

		it("tests _exitFullscreen when in pseudo-fullscreen mode", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);
				const wrapper = new GeomapFullscreenControlWrapper({ container: geoMapDom });

				wrapper._controlContainer = document.createElement("div");
				wrapper._onClickFullscreen = () => {};
				wrapper._changeIcon = () => {};
				wrapper._map = { resize: () => {} };

				// Simulate pseudo-fullscreen mode by adding the class
				wrapper._container.classList.add("maplibregl-pseudo-fullscreen");

				const spyTogglePseudoFullScreen = cy.stub(wrapper, "_togglePseudoFullScreen");

				// Act
				wrapper._exitFullscreen();

				// Assert
				expect(spyTogglePseudoFullScreen.callCount).to.equal(1);
			});
		});

		it("tests _exitFullscreen when NOT in pseudo-fullscreen mode", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);
				const wrapper = new GeomapFullscreenControlWrapper({ container: geoMapDom });

				wrapper._controlContainer = document.createElement("div");
				wrapper._onClickFullscreen = () => {};
				wrapper._changeIcon = () => {};

				// Ensure container does NOT have pseudo-fullscreen class
				wrapper._container.classList.remove("maplibregl-pseudo-fullscreen");

				const spyTogglePseudoFullScreen = cy.stub(wrapper, "_togglePseudoFullScreen");

				// Act
				wrapper._exitFullscreen();

				// Assert - should NOT call _togglePseudoFullScreen directly
				expect(spyTogglePseudoFullScreen.callCount).to.equal(0);
			});
		});
	});
});
