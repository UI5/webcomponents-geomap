import { html } from "lit";
import { setClickDelay } from "../../src/config/Config.js";
import "../../src/Geomap.js";
import type Geomap from "../../src/Geomap.js";
import "../../src/GeomapProvider.js";
import "../../src/GeomapSpot.js";
import "../../src/GeomapContainer.js";
import "../../src/GeomapNavigationControl.js";
import "../../src/GeomapFullscreenControl.js";
import "../../src/GeomapScaleControl.js";
import "../../src/GeomapSource.js";
import "../../src/GeomapGeocircle.js";
import "../../src/GeomapSelectionControl.js";
import GeomapGeometryUtil from "../../src/geometry/GeomapGeometryUtil.js";

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
            <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
        </ui5-geomap>`).as("geomap");
    });

    describe("test properties", () => {
        it("tests ui5-geomap root rendering, BGSOFUISAKAR-1036, BGSOFUISAKAR-1016, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").shadow().find(".ui5-geomap.maplibregl-map").should("exist");
        });

        it("tests centerLng and centerLat properties, BGSOFUISAKAR-1036, BGSOFUISAKAR-1016, BGSOFUISAKAR-1066, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getCenter()).deep.equal({ lng: 0, lat: 0 });

                // Act
                geoMapDom.centerLng = 10;
                geoMapDom.centerLat = 20;

                // Assert
                expect(geoMapDom.map.getCenter()).deep.equal({ lng: 10, lat: 20 });
            });
        });

        it("tests zoom property, BGSOFUISAKAR-1036, BGSOFUISAKAR-1016, BGSOFUISAKAR-1066, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getZoom()).equal(2);

                // Act
                geoMapDom.zoom = 10;

                // Assert
                expect(geoMapDom.map.getZoom()).equal(10);
            });
        });

        it("tests rotation property, BGSOFUISAKAR-1036, BGSOFUISAKAR-1066, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getBearing()).equal(0);

                // Act
                geoMapDom.rotation = 90;

                // Assert
                expect(geoMapDom.map.getBearing()).equal(90);
            });
        });

        it("tests tilt property, BGSOFUISAKAR-1036, BGSOFUISAKAR-1066, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getPitch()).equal(0);

                // Act
                geoMapDom.tilt = 45;

                // Assert
                expect(geoMapDom.map.getPitch()).equal(45);
            });
        });

        it("tests restrictedArea properties, BGSOFUISAKAR-1036, BGSOFUISAKAR-1066, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getMaxBounds()).to.equal(null);

                // Act
                geoMapDom.restrictedAreaWestSouthPointLng = -10;
                geoMapDom.restrictedAreaWestSouthPointLat = -10;
                geoMapDom.restrictedAreaEastNorthPointLng = 10;
                geoMapDom.restrictedAreaEastNorthPointLat = 10;

                // Assert
                expect(geoMapDom.map.getMaxBounds().toArray()).deep.equal([[-10, -10], [10, 10]]);

				// Act
				geoMapDom.restrictedAreaWestSouthPointLng = 0;
				geoMapDom.restrictedAreaEastNorthPointLng = 0;

				// Assert
				expect(geoMapDom.map.getMaxBounds()).to.equal(null);
            });
        });

        it("tests minZoom property, BGSOFUISAKAR-1036, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getMinZoom()).equal(0);

                // Act
                geoMapDom.minZoom = 5;

                // Assert
                expect(geoMapDom.map.getMinZoom()).equal(5);
            });
        });

        it("tests maxZoom property, BGSOFUISAKAR-1036, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getMaxZoom()).equal(24);

                // Act
                geoMapDom.maxZoom = 15;

                // Assert
                expect(geoMapDom.map.getMaxZoom()).equal(15);
            });
        });

        it("tests minTilt property, BGSOFUISAKAR-1036, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getMinPitch()).equal(0);

                // Act
                geoMapDom.minTilt = 10;

                // Assert
                expect(geoMapDom.map.getMinPitch()).equal(10);
            });
        });

        it("tests maxTilt property, BGSOFUISAKAR-1036, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.map.getMaxPitch()).equal(60);

                // Act
                geoMapDom.maxTilt = 45;

                // Assert
                expect(geoMapDom.map.getMaxPitch()).equal(45);
            });
        });
    });

    describe("test events", () => {
        it("tests map-center event on zoom, BGSOFUISAKAR-1036, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-center", spy);

                // Act
                const evObj = new WheelEvent('wheel');
                geoMapDom.map.fire({ type: "zoomend", originalEvent: evObj });

                // Assert
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].detail).to.deep.equal({ centerLng: 0, centerLat: 0 });
            });
        });

        it("tests map-center event on drag, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066, BGSOFUISAKAR-1029", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-center", spy);

                // Act
                const evObj = document.createEvent('MouseEvent');
                geoMapDom.map.fire({ type: "dragend", originalEvent: evObj });

                // Assert
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].detail).to.deep.equal({ centerLng: 0, centerLat: 0 });
            });
        });

        it("tests map-zoom event, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-zoom", spy);

                // Act
                const evObj = new WheelEvent('wheel');
                geoMapDom.map.fire({ type: "zoomend", originalEvent: evObj });

                // Assert
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].detail).to.deep.equal({ zoom: 2 });
            });
        });

        it("tests map-rotate event, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-rotate", spy);

                // Act
                geoMapDom.map.fire({ type: "rotateend", target: geoMapDom.map, bearing: 0 });

                // Assert
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].detail).to.deep.equal({ rotation: 0 });
            });
        });

        it("tests map-tilt event, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-tilt", spy);

                // Act
                geoMapDom.map.fire({ type: "pitchend", target: geoMapDom.map });

                // Assert
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].detail).to.deep.equal({ tilt: 0 });
            });
        });

		it("tests map-click event, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066, BGSOFUISAKAR-1704", () => {
			const clickSpy = cy.spy().as("clickSpy");
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);
				geoMapDom.addEventListener("map-click", clickSpy);

				// Act
				const evObj = new MouseEvent("click");
				geoMapDom.map.fire({ type: "click", originalEvent: evObj, lngLat: { lng: 10, lat: 20 } });
			});

			cy.get("@clickSpy").should("have.been.calledOnce");
			cy.get("@clickSpy").should("have.been.calledWithMatch", {
				detail: { lng: 10, lat: 20, point: undefined },
			});
		});

        it("tests map-click is not fired when followed by dblclick - BGSOFUISAKAR-1704", () => {
            const clickSpy = cy.spy().as("suppressedClickSpy");
            const dblclickSpy = cy.spy().as("dblclickSpy");
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                setClickDelay(50);
                geoMapDom.addEventListener("map-click", clickSpy);
                geoMapDom.addEventListener("map-dblclick", dblclickSpy);

                // Act — simulate double-click sequence
                const evObj = new MouseEvent("click");
                geoMapDom.map.fire({ type: "click", originalEvent: evObj, lngLat: { lng: 10, lat: 20 } });
                geoMapDom.map.fire({ type: "click", originalEvent: evObj, lngLat: { lng: 10, lat: 20 } });
                geoMapDom.map.fire({ type: "dblclick", originalEvent: evObj, lngLat: { lng: 10, lat: 20 } });
            });

            // dblclick fires immediately
            cy.get("@dblclickSpy").should("have.been.calledOnce");
            // wait past the delay window to confirm map-click timer was cancelled
            cy.wait(100);
            cy.get("@suppressedClickSpy").should("not.have.been.called");

            // Cleanup
            cy.then(() => setClickDelay(300));
        });

        it("tests map-dblclick event - BGSOFUISAKAR-1704", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-dblclick", spy);

                // Act
                const evObj = new MouseEvent("dblclick");
                geoMapDom.map.fire({ type: "dblclick", originalEvent: evObj, lngLat: { lng: 10, lat: 20 } });

                // Assert
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].detail).to.deep.equal({ lng: 10, lat: 20, point: undefined });
            });
        });

        it("tests map-mouseup event, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-mouseup", spy);

                // Act
                const evObj = document.createEvent('MouseEvents');
                geoMapDom.map.fire({ type: "mouseup", originalEvent: evObj, lngLat: { lng: 10, lat: 20 } });

                // Assert
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].detail).to.deep.equal({ lng: 10, lat: 20 });
            });
        });

        it("tests map-mousemove event, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-mousemove", spy);

                // Act
                const evObj = document.createEvent('MouseEvents');
                geoMapDom.map.fire({ type: "mousemove", originalEvent: evObj, lngLat: { lng: 10, lat: 20 } });

                // Assert
                expect(spy.callCount).to.equal(1);
                expect(spy.getCall(0).args[0].detail).to.deep.equal({ lng: 10, lat: 20 });
            });
        });

        it("tests map-render event, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-render", spy);

                // Act
                geoMapDom.map.fire({ type: "render" });

                // Assert
                expect(spy.callCount).to.equal(1);
            });
        });

        it("tests map-bounds-change event, BGSOFUISAKAR-1152, BGSOFUISAKAR-1066", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const spy = cy.spy();
                geoMapDom.addEventListener("map-bounds-change", spy);

                // Act
                let evObj = new WheelEvent('wheel');
                geoMapDom.map.fire({ type: "zoomend", originalEvent: evObj });

                // Assert
                expect(spy.callCount).to.equal(1);

                // Cleanup
                spy.resetHistory();

                // Act
                evObj = document.createEvent('MouseEvent');
                geoMapDom.map.fire({ type: "dragend", originalEvent: evObj });

                // Assert
                expect(spy.callCount).to.equal(1);

                // Cleanup
                spy.resetHistory();

                // Act
                geoMapDom.map.fire({ type: "rotateend", target: geoMapDom.map, bearing: 0 });

                // Assert
                expect(spy.callCount).to.equal(1);

                // Cleanup
                spy.resetHistory();

                // Act
                geoMapDom.map.fire({ type: "pitchend", target: geoMapDom.map });

                // Assert
                expect(spy.callCount).to.equal(1);
            });
        });
    });

    describe("test methods", () => {
        it("tests provider method, BGSOFUISAKAR-1246, BGSOFUISAKAR-1066", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.provider).to.have.lengthOf(1);
                expect(geoMapDom.provider[0].getAttribute("style-url")).to.equal("https://demotiles.maplibre.org/style.json");
            });
        });

        it("tests markers method, BGSOFUISAKAR-1066", () => {
            cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
                <ui5-geomap-spot lat="49.55" lng="8.9"></ui5-geomap-spot>
                <ui5-geomap-container lat="51.00" lng="8.6">
                    <div class="circle" style="background: red; width: 50px; height: 50px;">15%</div>
                </ui5-geomap-container>
            </ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.markers).to.have.lengthOf(2);
                expect(geoMapDom.markers[0].getAttribute("lat")).to.equal("49.55"); // ui5-geomap-spot
                expect(geoMapDom.markers[0].getAttribute("lng")).to.equal("8.9"); // ui5-geomap-spot
                expect(geoMapDom.markers[1].getAttribute("lat")).to.equal("51"); // ui5-geomap-container
                expect(geoMapDom.markers[1].getAttribute("lng")).to.equal("8.6"); // ui5-geomap-container
            });
        });

        it("tests controls method, BGSOFUISAKAR-1246, BGSOFUISAKAR-1066", () => {
            cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.controls).to.have.lengthOf(3);
                expect(geoMapDom.controls[0].getAttribute("no-compass")).to.exist; // ui5-geomap-navigation-control
                expect(geoMapDom.controls[1].getAttribute("position")).to.equal("TopRight"); // ui5-geomap-fullscreen-control
                expect(geoMapDom.controls[2].getAttribute("units")).to.equal("Imperial"); // ui5-geomap-scale-control
                expect(geoMapDom.controls[2].getAttribute("position")).to.equal("BottomRight"); // ui5-geomap-scale-control
            });
        });

        it("tests layers method", () => {
            cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.layers).to.have.lengthOf(2);
                expect(geoMapDom.layers[0].getAttribute("fill-color")).to.equal("green");
                expect(geoMapDom.layers[1].getAttribute("fill-color")).to.equal("blue");
            });
        });

        it("tests getLayersAt method", () => {
            cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.layers).to.have.lengthOf(2);
                expect(geoMapDom.layers[0].getAttribute("fill-color")).to.equal("green");
                expect(geoMapDom.layers[1].getAttribute("fill-color")).to.equal("blue");

                // Arrange
                cy.stub(geoMapDom.map, "queryRenderedFeatures").returns([{layer: geoMapDom.layers[0]}, {layer: geoMapDom.layers[1]}]);
                cy.spy(geoMapDom, "getLayerById");

				// Act
				const layers = geoMapDom.getLayersAt({lng: 8.4037, lat: 49.0069});
				expect(layers).to.exist;
                expect(layers).to.have.length(2);
                expect(geoMapDom.getLayerById.callCount).to.equal(2);
            });
        });

        it("tests getLayerById method", () => {
            cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
				const layer = geoMapDom.getLayerById(geoMapDom.layers[0]._id);

                // Assert
                expect(layer).to.exist;
            });
        });

        it("tests flyTo method", () => {
            cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
				const spy = cy.spy(geoMapDom.map, "flyTo");

				// Act
				geoMapDom.flyTo(8.4037, 49.0069, 10);

                // Assert
                expect(spy.callCount).to.equal(1);
            });
        });

        it("tests connectToItems method", () => {
            cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
				const spy = cy.spy(geoMapDom, "_connectToMap");
				let c = 0;
				geoMapDom.controls[1].connectToMap = () => {
					c++;
					return true;
				};
				geoMapDom.items[0].connectToMap = () => {
					c++;
					return true;
				};

				// Act
				geoMapDom.connectToItems();

                // Assert
                expect(spy.callCount).to.equal(6);
                expect(c).to.equal(2);
            });
        });

        it("tests canvas method", () => {
            cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Assert
                expect(geoMapDom.canvas).to.exist;
            });
        });

        it("tests takeScreenshot method", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Act
                cy.wrap(geoMapDom.takeScreenshot()).then((dataUrl: unknown) => {
                    // Assert
                    expect(dataUrl).to.be.a("string");
                    expect(dataUrl as string).to.match(/^data:image\/png;base64,/);
                });
            });
        });

        it("tests takeScreenshot method with jpeg type", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Act
                cy.wrap(geoMapDom.takeScreenshot("image/jpeg", 0.8)).then((dataUrl: unknown) => {
                    // Assert
                    expect(dataUrl).to.be.a("string");
                    expect(dataUrl as string).to.match(/^data:image\/jpeg;base64,/);
                });
            });
        });

        it("tests takeScreenshot rejects when map is not initialized", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const originalMap = geoMapDom.map;
                geoMapDom.map = null;

                // Act & Assert
                cy.wrap(geoMapDom.takeScreenshot().catch((e: Error) => e.message)).then((msg: unknown) => {
                    expect(msg).to.equal("Map is not initialized");
                    // Restore
                    geoMapDom.map = originalMap;
                });
            });
        });

        it("tests takeScreenshot method with spots", () => {
            cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
                <ui5-geomap-spot lat="49.4" lng="8.5" color="red"></ui5-geomap-spot>
                <ui5-geomap-spot lat="48.1351" lng="11.582" color="blue"></ui5-geomap-spot>
            </ui5-geomap>`).as("geomapWithSpots");

            cy.get("@geomapWithSpots").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const pathD = "M8 0C4.686 0 2 2.686 2 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6z";

                const fakePath = { getAttribute: () => pathD };
                const fakeIconShadowRoot = { querySelector: () => fakePath };
                const fakeIcon = { shadowRoot: fakeIconShadowRoot };
                const fakeSpotShadowRoot = { querySelector: () => fakeIcon };
                const fakeRect = { left: 10, top: 10, width: 32, height: 32 };
                const fakeElement = {
                    shadowRoot: fakeSpotShadowRoot,
                    getBoundingClientRect: () => fakeRect,
                };

                geoMapDom.markers.forEach((marker: any) => {
                    marker.markerInstance.getElement = () => fakeElement;
                });

                // Act
                cy.wrap(geoMapDom.takeScreenshot()).then((dataUrl: unknown) => {
                    // Assert
                    expect(dataUrl).to.be.a("string");
                    expect(dataUrl as string).to.match(/^data:image\/png;base64,/);
                });
            });
        });

        it("tests takeScreenshot uses dpr fallback when canvasRect.width is 0", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const origGetBoundingClientRect = geoMapDom.canvas.getBoundingClientRect.bind(geoMapDom.canvas);
                cy.stub(geoMapDom.canvas, "getBoundingClientRect").callsFake(() => {
                    const rect = origGetBoundingClientRect();
                    return { ...rect, width: 0, height: rect.height };
                });

                // Act
                cy.wrap(geoMapDom.takeScreenshot()).then((dataUrl: unknown) => {
                    // Assert — still resolves with a valid data URL despite width=0
                    expect(dataUrl as string).to.match(/^data:image\/png;base64,/);
                });
            });
        });

        it("tests takeScreenshot rejects when toDataURL throws", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
                HTMLCanvasElement.prototype.toDataURL = () => { throw new Error("toDataURL failed"); };

                // Act & Assert
                cy.wrap(geoMapDom.takeScreenshot().catch((e: Error) => e.message)).then((msg: unknown) => {
                    expect(msg).to.equal("toDataURL failed");
                    HTMLCanvasElement.prototype.toDataURL = origToDataURL;
                });
            });
        });

        it("tests getBounds method", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);

                // Act
                const bounds = geoMapDom.getBounds();

                // Assert
                expect(bounds).to.have.property("west");
                expect(bounds).to.have.property("south");
                expect(bounds).to.have.property("east");
                expect(bounds).to.have.property("north");
            });
        });

        it("tests collectElements method for selection, BGSOFUISAKAR-1139", () => {
            cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
                <ui5-geomap-source id="earthquakes" geojson-url="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"></ui5-geomap-source>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const coordinates = [
                    [-40.45166015625,55.776573018667705],
                    [-40.45166015625,66.53951732435127],
                    [22.5,66.53951732435127],[22.5,55.776573018667705],
                    [-40.45166015625,55.776573018667705]
                ];
                cy.stub(geoMapDom.map, "queryRenderedFeatures").returns([{
                    "geometry" :{
                        "type":"Polygon",
                        "coordinates":[coordinates]
                    },
                    "source":"earthquakes",
                }]);

                // Act
                const elements = geoMapDom.collectElements(true, false);

                // Assert
                expect(elements).to.have.property("result");
                expect(elements.result).to.have.length(1);
                expect(elements.result[0]).to.have.property("coordinates");
                expect(elements.result[0].coordinates[0]).to.be.equal(coordinates);
            });
        });

        it("tests collectElements method for bounds", () => {
            cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
                <ui5-geomap-source id="earthquakes" geojson-url="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"></ui5-geomap-source>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const coordinates = [
                    [-40.45166015625,55.776573018667705],
                    [-40.45166015625,66.53951732435127],
                    [22.5,66.53951732435127],[22.5,55.776573018667705],
                    [-40.45166015625,55.776573018667705]
                ];
                cy.stub(geoMapDom.map, "queryRenderedFeatures").returns([{
                    "geometry" :{
                        "type":"Polygon",
                        "coordinates":[coordinates]
                    },
                    "source":"earthquakes",
                }]);

                // Act
                const elements = geoMapDom.collectElements(false, true);

                // Assert
                expect(elements).to.have.property("bounds");
                expect(elements.bounds).to.have.length(5);
                expect(elements.bounds[0]).to.be.equal(coordinates[0]);
            });
        });

		it("tests transformQueryMarkerElements method for selection", () => {
			cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
                <ui5-geomap-source id="earthquakes" geojson-url="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"></ui5-geomap-source>
			</ui5-geomap>`).as("geomap");

			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const coordinates = [
					[-40.45166015625,55.776573018667705],
					[-40.45166015625,66.53951732435127],
					[22.5,66.53951732435127],[22.5,55.776573018667705],
					[-40.45166015625,55.776573018667705]
				];
				cy.stub(geoMapDom.map, "queryRenderedFeatures").returns([{
					"geometry" :{
						"type":"Polygon",
						"coordinates":[coordinates]
					},
					"source":"earthquakes",
				}]);

				// Act
				const res = geoMapDom.transformQueryMarkerElements([]);

				// Assert
				expect(res).to.have.length(0);
			});
		});

		it("tests transformQueryMarkerElements method for selection with markers", () => {
			cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-spot lat="49.55" lng="8.9"></ui5-geomap-spot>
			</ui5-geomap>`).as("geomap");

			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const coordinates = [
					[-40.45166015625,55.776573018667705],
					[-40.45166015625,66.53951732435127],
					[22.5,66.53951732435127],[22.5,55.776573018667705],
					[-40.45166015625,55.776573018667705]
				];
				cy.stub(geoMapDom.map, "queryRenderedFeatures").returns([{
					"geometry" :{
						"type":"Polygon",
						"coordinates":[coordinates]
					},
					"source":"earthquakes",
				}]);
				cy.stub(geoMapDom.shadowRoot, "querySelectorAll").returns([
					{
						tagName : "SAP-GEOMAP-SPOT-COMPONENT",
						lng: 8.9,
						lat: 49.55
					}
				]);

				// Act
				const res = geoMapDom.transformQueryMarkerElements([]);

				// Assert
				expect(res).to.have.length(1);
				expect(res[0].type).to.equal("Feature");
				expect(res[0].geometry.type).to.equal("Point");
				expect(res[0].geometry.coordinates).to.deep.equal([8.9, 49.55]);
			});
		});

		it("tests collectElementsForSelection method for selection", () => {
			cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
                <ui5-geomap-source id="earthquakes" geojson-url="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"></ui5-geomap-source>
			</ui5-geomap>`).as("geomap");

			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const coordinates = [
					[-40.45166015625,55.776573018667705],
					[-40.45166015625,66.53951732435127],
					[22.5,66.53951732435127],[22.5,55.776573018667705],
					[-40.45166015625,55.776573018667705]
				];
				const f = {
					"geometry" :{
						"type":"Polygon",
						"coordinates":[coordinates]
					},
					"source":"earthquakes",
				};
				const r = [f];
				const mElements = [f];
				cy.stub(geoMapDom.map, "queryRenderedFeatures").returns(r);

				// Act
				const res = geoMapDom.collectElementsForSelection(["earthquakes"], mElements, []);

				// Assert
				expect(res).to.have.length(2);
				expect(res[0]).to.have.property("coordinates");
				expect(res[0].coordinates[0]).to.be.equal(coordinates);
				expect(res[1]).to.have.property("coordinates");
				expect(res[1].coordinates[0]).to.be.equal(coordinates);
			});
		});

		it("tests collectElementsForBounds method for selection", () => {
			cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
                <ui5-geomap-source id="earthquakes" geojson-url="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"></ui5-geomap-source>
			</ui5-geomap>`).as("geomap");

			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);

				const coordinates = [
					[-40.45166015625,55.776573018667705],
					[-40.45166015625,66.53951732435127],
					[22.5,66.53951732435127],[22.5,55.776573018667705],
					[-40.45166015625,55.776573018667705]
				];
				const f = {
					"geometry" :{
						"type":"Polygon",
						"coordinates":[coordinates]
					},
					"source":"earthquakes",
				};
				const r = [f];
				const mElements = [f];
				cy.stub(geoMapDom.map, "queryRenderedFeatures").returns(r);

				// Act
				const res = geoMapDom.collectElementsForBounds(["earthquakes"], mElements, []);

				// Assert
				expect(res).to.have.length(6);
			});
		});

        it("tests perfectZoom method for given bounds", () => {
            cy.mount(html`<ui5-geomap>
                <ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
                <ui5-geomap-source id="earthquakes" geojson-url="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"></ui5-geomap-source>
			</ui5-geomap>`).as("geomap");

            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const bounds = [
                    [
                        -40.45166015625,
                        55.776573018667705
                    ],
                    [
                        -40.45166015625,
                        66.53951732435127
                    ],
                    [
                        22.5,
                        66.53951732435127
                    ],
                    [
                        22.5,
                        55.776573018667705
                    ],
                    [
                        -40.45166015625,
                        55.776573018667705
                    ]
                ];
                const fitBounds = cy.spy(geoMapDom.map, "fitBounds");

                // Act
                geoMapDom.perfectZoom(bounds);

                // Assert
                expect(fitBounds.called).to.equal(true);
            });
        });

        it("tests perfectZoom method without bounds", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const elements = {bounds: ["bound1"]};
                const fitBounds = cy.stub(geoMapDom.map, "fitBounds");
                const collectElements = cy.stub(geoMapDom, "collectElements").returns(elements);

                // Act
                geoMapDom.perfectZoom();

                // Assert
                expect(collectElements.called).to.equal(true);
                expect(fitBounds.called).to.equal(true);
                expect(fitBounds.calledWith(elements.bounds)).to.equal(true);
            });
        });

		it("tests perfectZoom method without bounds and with no results", () => {
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);
				const elements = {bounds: []};
				const fitBounds = cy.stub(geoMapDom.map, "fitBounds");
				const collectElements = cy.stub(geoMapDom, "collectElements").returns(elements);

				// Act
				const r = geoMapDom.perfectZoom();

				// Assert
				expect(r).to.be.undefined;
				expect(collectElements.called).to.equal(true);
				expect(fitBounds.called).to.equal(false);
			});
		});

		it("tests perfectZoomV2 method without bounds", () => {
			cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
				const bounds = [
						{
							lng: -40.45166015625,
							lat: 55.776573018667705
						},
						{
							lng: -40.45166015625,
							lat: 66.53951732435127
						},
						{
							lng: 22.5,
							lat: 66.53951732435127
						},
						{
							lng: 22.5,
							lat: 55.776573018667705
						},
					{
						lng: -40.45166015625,
						lat: 55.776573018667705
					}
				];
                let elements = {bounds: []};
                const getZoom = cy.stub(geoMapDom.map, "getZoom");
				getZoom.returns(3);
                const flyTo = cy.stub(geoMapDom.map, "flyTo");
                const setZoom = cy.stub(geoMapDom.map, "setZoom");
                const collectElements = cy.stub(geoMapDom, "collectElements").returns(elements);
				const center = {
					bbox: undefined,
					id: undefined,
					properties: {},
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [-15.27099609375, 60.08175074094113]
					}
				};

                // Act
                const r = geoMapDom._perfectZoomV2();

                // Assert
                expect(r).to.be.undefined;
                expect(collectElements.called).to.equal(true);
                expect(getZoom.called).to.equal(true);
                expect(setZoom.called).to.equal(false);
                expect(flyTo.called).to.equal(false);

				// Arrange
				elements = {bounds: bounds};

				// Act
				geoMapDom._perfectZoomV2(elements.bounds);

				// Assert
				expect(collectElements.called).to.equal(true);
				expect(getZoom.called).to.equal(true);
				expect(setZoom.called).to.equal(true);
				expect(flyTo.called).to.equal(true);
				expect(setZoom.calledWith(2)).to.equal(true);
				expect(flyTo.calledWith(center)).to.equal(true);
            });
        });

        it("tests getElementsInSelectedArea method, BGSOFUISAKAR-1139", () => {
            cy.get("@geomap").then(($geomap) => {
                // Arrange
                const geoMapDom = $geomap.get(0);
                const pointin = cy.stub(GeomapGeometryUtil, "isPointInPolygon");
                pointin.returns(true);

                const area = [
                    [
                        [
                            63.235201744,
                            11.831678623
                        ],
                        [
                            -21.443982216,
                            11.831678623
                        ],
                        [
                            -21.443982216,
                            61.581217265
                        ],
                        [
                            63.235201744,
                            61.581217265
                        ],
                        [
                            63.235201744,
                            11.831678623
                        ]
                    ]
                ];
                const coordinates = [
                    [-40.45166015625,55.776573018667705],
                    [-40.45166015625,66.53951732435127],
                    [22.5,66.53951732435127],[22.5,55.776573018667705],
                    [-40.45166015625,55.776573018667705]
                ];
                const point =                         {
                    "type": "Point",
                    "coordinates": [
                        -8.5693359375,
                        37.125286284966805
                    ]
                };
                const polygon = {
                    "type": "Polygon",
                    "coordinates": coordinates
                };
                const linestring = {
                    "type": "LineString",
                    "coordinates": [
                        -8.5693359375,
                        37.125286284966805
                    ]
                }
                cy.stub(geoMapDom.map, "queryRenderedFeatures").returns([
                    {
                        "geometry" :{
                            "type":"Polygon",
                            "coordinates":[coordinates]
                        },
                        "source":"earthquakes",
                    }

                ]);
                const collected = cy.stub(geoMapDom, "collectElements");
                collected.returns({
                    bounds: [],
                    result: [point]
                });

                // Act
                let elements = geoMapDom.getElementsInSelectedArea(area);

                // Assert
                expect(elements).to.have.length(1);
                expect(elements[0]).to.equal(point);

                // Arrange
                pointin.returns(false);

                // Act
                elements = geoMapDom.getElementsInSelectedArea(area);

                // arrange
                expect(elements).to.have.length(0);

                // Arrange
                collected.returns({
                    bounds: [],
                    result: [polygon]
                });
                pointin.returns(true);

                // Act
                elements = geoMapDom.getElementsInSelectedArea(area);

                //Assert
                expect(elements).to.have.length(1);
                expect(elements[0]).to.equal(polygon);

                // Arrange
                pointin.returns(false);

                 // Act
                 elements = geoMapDom.getElementsInSelectedArea(area);

                 //Assert
                 expect(elements).to.have.length(0);

                // Arrange
                pointin.returns(true);
                collected.returns({
                    bounds: [],
                    result: [linestring]
                });

                // Act
                elements = geoMapDom.getElementsInSelectedArea(area);

                //Assert
                expect(elements).to.have.length(1);
                expect(elements[0]).to.equal(linestring);


                // Arrange
                pointin.returns(false);

                // Act
                elements = geoMapDom.getElementsInSelectedArea(area);

                //Assert
                expect(elements).to.have.length(0);

            });
        });

		it("tests handleInvalidation method", () => {
			cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);
				const connectToItems = cy.spy(geoMapDom, "connectToItems");
				const map = geoMapDom.map;
				let r;
				geoMapDom.map = null;

				// Act
				r = geoMapDom.handleInvalidation();

				// Assert
				expect(r).to.be.undefined;

				// Arrange
				geoMapDom.map = map;

				// Act
				r = geoMapDom.handleInvalidation({type: "slot"});

				// Assert
				expect(connectToItems.callCount).to.equal(1);
			});
		});


		it("tests onStyleUpdate method", () => {
			cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
				<ui5-geomap-geocircle class="clickable-layer" lat="49.0069" lng="8.4037" radius="10" units="kilometers"
									  fill-color="green" opacity="0.7" outline-color="black"></ui5-geomap-geocircle>
				<ui5-geomap-geocircle class="clickable-layer" lat="48.7758" lng="9.1829" radius="10" units="miles"
									  fill-color="blue" opacity="0.3" outline-color="black"></ui5-geomap-geocircle>
			</ui5-geomap>`).as("geomap");
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const geoMapDom = $geomap.get(0);
				const setStyle = cy.stub(geoMapDom.map, "setStyle");
				const provider = geoMapDom.controls[0];

				// Act
				geoMapDom.onStyleUpdate();

				// Assert
				expect(setStyle.called).to.equal(true);
				expect(setStyle.calledWith("https://demotiles.maplibre.org/style.json")).to.equal(true);

				// Act
				geoMapDom._provider.setAttribute("style-url", "https://dummy/map-style/url");
				geoMapDom.onStyleUpdate();

				// Assert
				expect(setStyle.called).to.equal(true);
				expect(setStyle.calledWith("https://dummy/map-style/url")).to.equal(true);

				// Act
				const oRasterStyle = {
					"version": 8,
					"sources": {
						"raster-tiles": {
							"type": "raster",
							"tiles": [
								"https://dummy/mapping/v1/here/tiles/maptile/newest/normal.day/{z}/{x}/{y}/256/png"
							],
							"tileSize": 256
						}
					},
					"layers": [
						{
							"id": "simple-tiles",
							"type": "raster",
							"source": "raster-tiles",
							"minzoom": 0,
							"maxzoom": 22,
							"paint": {
								"raster-opacity": 0.6
							}
						}
					]
				};
				geoMapDom._provider.styleUrl = oRasterStyle;
				geoMapDom.onStyleUpdate();

				// Assert
				expect(setStyle.called).to.equal(true);
				expect(setStyle.calledWith(oRasterStyle)).to.equal(true);
			});
		});

		it("tests createMap method without valid configuration", () => {
			cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="incorrectDummyUrlAddress"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
			</ui5-geomap>`).as("geomap");
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const g = $geomap.get(0);

				g.createMap().catch((e) => {
					expect(e).to.be.instanceOf(Error);
					expect(e.message).to.equal("Invalid configuration of the provider");
				});

				g.controls[0].setAttribute("style-url", "https://demotiles.maplibre.org/style.json");
			});
		});

		it("tests _checkWorkerAllowed", () => {
			cy.mount(html`<ui5-geomap>
				<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
				<ui5-geomap-navigation-control slot="mapControls" no-compass></ui5-geomap-navigation-control>
				<ui5-geomap-fullscreen-control slot="mapControls" position="TopRight"></ui5-geomap-fullscreen-control>
				<ui5-geomap-scale-control slot="mapControls" units="Imperial" position="BottomRight"></ui5-geomap-scale-control>
			</ui5-geomap>`).as("geomap");
			cy.get("@geomap").then(($geomap) => {
				// Arrange
				const g = $geomap.get(0);

				try {
				const r = g._checkWorkerAllowed();
				} catch (e) {
					expect(e).to.be.instanceOf(Error);
					expect(e.message).to.equal("No path provided.");
				}

			});
		});
	});

});

describe("ui5-geomap programmatic selection - BGSOFUISAKAR-1671", () => {
	const polygonCoords = [
		[8.0, 48.0], [9.0, 48.0], [9.0, 49.0], [8.0, 49.0], [8.0, 48.0],
	];

	const hasPolygonCoords = (snapshot: any[], coords: number[][]) =>
		snapshot.some((f: any) =>
			f.geometry?.type === "Polygon" &&
			JSON.stringify(f.geometry.coordinates[0]) === JSON.stringify(coords)
		);

	const polygonFeature = {
		type: "Feature" as const,
		geometry: { type: "Polygon" as const, coordinates: [polygonCoords] },
		properties: {},
	};

	beforeEach(() => {
		cy.intercept("GET", "https://basemaps-api.arcgis.com/arcgis/rest/services/styles/*", {
			fixture: "ArcGIS_Streets.json",
			log: false,
		});
		cy.intercept("GET", "https://basemaps-api.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer?*", {
			fixture: "VectorTileServer.json",
			log: false,
		});
		cy.intercept("GET", /^https:\/\/basemaps-api\.arcgis\.com\/.*VectorTileServer\/tile/, { body: "mocked", log: false });
		cy.intercept("GET", /^https:\/\/cdn\.arcgis\.com\/.*sprite/, { body: "{}", log: false });

		cy.mount(html`<ui5-geomap>
			<ui5-geomap-provider slot="mapControls" style-url="https://demotiles.maplibre.org/style.json"></ui5-geomap-provider>
		</ui5-geomap>`).as("sel");

		// Wait deterministically for map-load (fired at the end of onEnterDOM,
		// right after `draw` is set), with a fallback for the "already loaded"
		// case so we don't hang waiting for an event that already fired.
		cy.get("@sel").then(($el) => {
			const el = $el.get(0) as any;
			return new Cypress.Promise((resolve: () => void, reject: (err: Error) => void) => {
				if (el.draw) {
					resolve();
					return;
				}
				const timer = setTimeout(() => reject(new Error("ui5-geomap map-load event timed out after 10 s")), 10000);
				el.addEventListener("map-load", () => { clearTimeout(timer); resolve(); }, { once: true });
			});
		});
	});

	it("setSelection / removeSelection / getSelection - core behaviour", () => {
		cy.get("@sel").then(($el) => {
			const map = $el.get(0) as unknown as Geomap;
			map.removeSelection();

			// setSelection adds a polygon to the draw store
			map.setSelection(polygonFeature);
			expect(hasPolygonCoords(map.draw.getSnapshot(), polygonCoords)).to.equal(true);

			// setSelection replaces the previous programmatic selection
			const newCoords = [[10.0, 48.0], [11.0, 48.0], [11.0, 49.0], [10.0, 49.0], [10.0, 48.0]];
			map.setSelection({
				type: "Feature",
				geometry: { type: "Polygon", coordinates: [newCoords] },
				properties: {},
			});
			expect(hasPolygonCoords(map.draw.getSnapshot(), polygonCoords)).to.equal(false);
			expect(hasPolygonCoords(map.draw.getSnapshot(), newCoords)).to.equal(true);

			// removeSelection clears programmatic features
			map.setSelection(polygonFeature);
			expect(hasPolygonCoords(map.draw.getSnapshot(), polygonCoords)).to.equal(true);
			map.removeSelection();
			expect(hasPolygonCoords(map.draw.getSnapshot(), polygonCoords)).to.equal(false);

			// removeSelection leaves user-drawn features intact
			map.setSelection(polygonFeature);
			const userCoords = [[[7.0, 47.0], [8.0, 47.0], [8.0, 48.0], [7.0, 47.0]]];
			const [result] = map.draw.addFeatures([{
				type: "Feature",
				geometry: { type: "Polygon", coordinates: userCoords },
				properties: { mode: "polygon" },
			}]);
			expect(result.valid).to.equal(true);
			map.removeSelection();
			const afterClear = map.draw.getSnapshot();
			expect(hasPolygonCoords(afterClear, polygonCoords)).to.equal(false);
			expect(afterClear.some((f: any) => f.id === result.id)).to.equal(true);
			map.draw.removeFeatures([result.id]);

			// getSelection returns what was set
			map.setSelection(polygonFeature);
			const selection = map.getSelection();
			expect(selection).to.have.length(1);
			expect(selection[0].geometry.type).to.equal("Polygon");
			const polygon = selection[0].geometry as { type: "Polygon"; coordinates: number[][][] };
			expect(JSON.stringify(polygon.coordinates[0])).to.equal(JSON.stringify(polygonCoords));
			map.removeSelection();

			// setSelection fires the selection-set event
			let eventFeature: any = null;
			map.addEventListener("selection-set", (e: Event) => {
				eventFeature = (e as CustomEvent).detail?.feature;
			}, { once: true });
			map.setSelection(polygonFeature);
			expect(eventFeature).to.exist;
			expect(eventFeature.geometry.type).to.equal("Polygon");
			expect(JSON.stringify(eventFeature.geometry.coordinates[0])).to.equal(JSON.stringify(polygonCoords));
			map.removeSelection();

			// setSelection supports LineString
			const lineCoords = [[8.0, 48.0], [9.0, 49.0]];
			map.setSelection({ type: "Feature", geometry: { type: "LineString", coordinates: lineCoords }, properties: {} });
			expect(map.draw.getSnapshot().some((f: any) =>
				f.geometry?.type === "LineString" &&
				JSON.stringify(f.geometry.coordinates) === JSON.stringify(lineCoords)
			)).to.equal(true);
			map.removeSelection();

			// setSelection supports Point
			const pointCoords = [8.6724, 49.3988];
			map.setSelection({ type: "Feature", geometry: { type: "Point", coordinates: pointCoords }, properties: {} });
			expect(map.draw.getSnapshot().some((f: any) =>
				f.geometry?.type === "Point" &&
				JSON.stringify(f.geometry.coordinates) === JSON.stringify(pointCoords)
			)).to.equal(true);
			map.removeSelection();

			// setSelection supports rectangle mode
			const rectCoords = [[8.0, 50.0], [13.0, 50.0], [13.0, 53.0], [8.0, 53.0], [8.0, 50.0]];
			map.setSelection({ type: "Feature", geometry: { type: "Polygon", coordinates: [rectCoords] }, properties: { mode: "rectangle" } });
			expect(hasPolygonCoords(map.draw.getSnapshot(), rectCoords)).to.equal(true);
			map.removeSelection();

			// setSelection supports circle mode
			const round = (v: number) => Math.round(v * 1e5) / 1e5;
			const centerLng = 2.3522; const centerLat = 48.8566; const radiusKm = 100; const steps = 64;
			const ring: number[][] = [];
			for (let i = 0; i < steps; i++) {
				const angle = (i / steps) * Math.PI * 2;
				ring.push([round(centerLng + (radiusKm / (111.32 * Math.cos((centerLat * Math.PI) / 180))) * Math.cos(angle)), round(centerLat + (radiusKm / 110.574) * Math.sin(angle))]);
			}
			ring.push([ring[0][0], ring[0][1]]);
			map.setSelection({ type: "Feature", geometry: { type: "Polygon", coordinates: [ring] }, properties: { mode: "circle", center: [centerLng, centerLat] } });
			expect(hasPolygonCoords(map.draw.getSnapshot(), ring)).to.equal(true);
			map.removeSelection();
		});
	});

	it("removeSelection clears pending selection; setSelection ignores mismatched geometry", () => {
		cy.get("@sel").then(($el) => {
			const map = $el.get(0) as unknown as Geomap;

			// removeSelection clears a pending selection before draw is available
			const savedDraw = map.draw;
			(map as any).draw = null;
			map.setSelection(polygonFeature);
			expect((map as any)._pendingSelection).to.exist;
			map.removeSelection();
			expect((map as any)._pendingSelection).to.equal(null);
			(map as any).draw = savedDraw;

			// setSelection ignores mismatched geometry and warns
			map.removeSelection();
			cy.stub(console, "warn").as("warn");
			map.setSelection({ type: "Feature", geometry: { type: "LineString", coordinates: [[8.0, 48.0], [9.0, 49.0]] }, properties: { mode: "polygon" } });
			expect(map.draw.getSnapshot().filter((f: any) => f.properties?.isProgrammaticFeature)).to.have.length(0);
			cy.get("@warn").should("have.been.calledWithMatch", /mode "polygon" requires Polygon geometry/);
		});
	});
});
