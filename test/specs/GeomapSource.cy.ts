import { html } from "lit";
import GeomapSource from "../../src/GeomapSource.js";
import Map from "../../src/extensions/Map";
import {setWorkerUrl} from "../../src/MapLibre.js";

describe("ui5-geomap-source", () => {
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

    describe("test properties", () => {
        it("tests geojsonUrl property", () => {
            cy.mount(html`<ui5-geomap-source geojson-url="https://myUrl.com"></ui5-geomap-source>`).as("geomapsource");
            cy.get("@geomapsource").then(($geosource) => {
                // Arrange
                const geomapsourceDom = $geosource.get(0);
                const state = geomapsourceDom._state;

                // Assert
                expect(state["geojsonUrl"]).to.equal("https://myUrl.com");

                // Act
                cy.log("Change geojsonUrl to yourUrl");
                geomapsourceDom.setAttribute("geojson-url", "https://yourUrl.com");
            });

            cy.get("@geomapsource").then(($geosource) => {
                // Arrange
                const geomapsourceDom = $geosource.get(0);
                const state = geomapsourceDom._state;

                // Assert
                expect(state["geojsonUrl"]).to.equal("https://yourUrl.com");
            });
        });
    });
    describe("test methods", () => {
        it("tests effectiveId method", () => {
            cy.mount(html`<ui5-geomap-source id="geoSource"></ui5-geomap-source>`).as("geomapsource");
            cy.get("@geomapsource").then(($geosource) => {
                // Arrange
                const geomapsourceDom = $geosource.get(0);

                // Act
                const id = geomapsourceDom.effectiveId;

                // Assert
                expect(id).to.equal("geoSource");

            });
        });
        it("tests effectiveData method", () => {
            cy.mount(html`<ui5-geomap-source geojson-url="https://myUrl.com"></ui5-geomap-source>`).as("geomapsource");
            cy.get("@geomapsource").then(($geosource) => {
                // Arrange
                const geomapsourceDom = $geosource.get(0);

                // Act
                const data = geomapsourceDom.effectiveData;

                // Assert
                expect(data).to.equal("https://myUrl.com");

            });
        });

        it("tests effectiveGeojson method", () => {
            cy.mount(html`<ui5-geomap-source geojson={url: "https://myUrl.com"}></ui5-geomap-source>`).as("geomapsource");
            cy.get("@geomapsource").then(($geosource) => {
                // Arrange
                const geomapsourceDom = $geosource.get(0);
				let expected = {
					type: "FeatureCollection",
					features: []
				};

                // Act
                let geojson = geomapsourceDom.effectiveGeojson;

                // Assert
                expect(geojson).to.deep.equal(expected);

				// Arrange
				expected = {
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [0, 0]
							},
						}
					]
				};
				geomapsourceDom.geojson = expected;

				// Act
				geojson = geomapsourceDom.effectiveGeojson;

				// Assert
				expect(geojson).to.deep.equal(expected);
            });
        });

        it("tests isGeomapSource method", () => {
            cy.mount(html`<ui5-geomap-source></ui5-geomap-source>`).as("geomapsource");
            cy.get("@geomapsource").then(($geosource) => {
                // Arrange
                const geomapsourceDom = $geosource.get(0);

                // Act
                const source = geomapsourceDom.isGeomapSource;

                // Assert
                expect(source).to.equal(true);
            });
        });

        it("tests handleInvalidation method", () => {
                // Arrange
                const source = new GeomapSource();
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                let callCount = 0;
                cy.stub(map, "getSource").returns({
                    setData: () => {
                        callCount++;
                    }
                });
                source.map = map;

                // Act
                source.handleInvalidation({type: "property", name: "geojsonUrl"});

                // Assert
                expect(callCount).to.equal(1);
        });

        it("tests source method", () => {
                // Arrange
                const source = new GeomapSource();
                const map = new Map({
                    container: document.createElement("div"),
                    attributionControl: false,
                    zoom: 5
                });
                cy.stub(map, "getSource")
                source.map = map;

                // Act
                source.source;

                // Assert
                expect(map.getSource.called).to.equal(true);
        });

        it("tests createOptions method", () => {
                // Arrange
                const source = new GeomapSource();

                // Act
                const r = source.createOptions;

                // Assert
                expect(r).to.deep.equal({});
        });

		it("tests setState method", () => {
			// Arrange
			const source = new GeomapSource();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			cy.stub(map, "setFeatureState")
			source.map = map;

			// Act
			source.setState(1, {});

			// Assert
			expect(map.setFeatureState.called).to.equal(true);
		});

		it("tests onEnterDOM method", async () => {
			// Arrange
			const source = new GeomapSource();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			source.map = map;
			const spy = cy.spy(source.map, "addSource");
			source.whenMapConnected = () => {
				return new Promise((resolve) => {
					resolve("done");
				});
			};

			// Act
			await source.onEnterDOM();

			// Assert
			expect(spy.callCount).to.equal(1);
		});

		it("tests onExitDOM method", () => {
			// Arrange
			const source = new GeomapSource();
			const map = new Map({
				container: document.createElement("div"),
				attributionControl: false,
				zoom: 5
			});
			cy.stub(map, "removeSource")
			source.map = map;

			// Act
			source.onExitDOM();

			// Assert
			expect(map.removeSource.called).to.equal(true);
		});
    });
});
