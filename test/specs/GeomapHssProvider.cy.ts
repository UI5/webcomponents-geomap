import { html } from "lit";
import "../../src/Geomap.js";
import "../../src/GeomapHssProvider.js";

describe("ui5-geomap-hss-provider", () => {
    beforeEach(() => {
		cy.on('uncaught:exception', (err, runnable) => {
			return false;
		});
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
		cy.on('uncaught:exception', (err, runnable) => {
			return false;
		});
        it("tests serviceUrl property, BGSOFUISAKAR-1248", () => {
            cy.mount(html`<ui5-geomap-hss-provider slot="mapControls" service-url="testServiceUrl"></ui5-geomap-hss-provider>`).as("geomapHssProvider");

            cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
                // Arrange
                const geomapHssProvider = $geomapHssProvider.get(0);
                const state = geomapHssProvider._state;

                // Assert
                expect(state["serviceUrl"]).to.equal("testServiceUrl");
            });
        });

        it("tests serviceAuthenticationUrl property, BGSOFUISAKAR-1248", () => {
            cy.mount(html`<ui5-geomap-hss-provider slot="mapControls" service-authentication-url="testServiceAuthenticationUrl"></ui5-geomap-hss-provider>`).as("geomapHssProvider");

            cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
                // Arrange
                const geomapHssProvider = $geomapHssProvider.get(0);
                const state = geomapHssProvider._state;

                // Assert
                expect(state["serviceAuthenticationUrl"]).to.equal("testServiceAuthenticationUrl");
            });
        });

        it("tests clientId property, BGSOFUISAKAR-1248", () => {
            cy.mount(html`<ui5-geomap-hss-provider slot="mapControls" client-id="testClientId"></ui5-geomap-hss-provider>`).as("geomapHssProvider");

            cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
                // Arrange
                const geomapHssProvider = $geomapHssProvider.get(0);
                const state = geomapHssProvider._state;

                // Assert
                expect(state["clientId"]).to.equal("testClientId");
            });
        });

		it("tests clientSecret property, BGSOFUISAKAR-1248", () => {
            cy.mount(html`<ui5-geomap-hss-provider slot="mapControls" client-secret="testClientSecret"></ui5-geomap-hss-provider>`).as("geomapHssProvider");

            cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
                // Arrange
                const geomapHssProvider = $geomapHssProvider.get(0);
                const state = geomapHssProvider._state;

                // Assert
                expect(state["clientSecret"]).to.equal("testClientSecret");
            });
        });

		it("tests styleUrl property, BGSOFUISAKAR-1248", () => {
            cy.mount(html`<ui5-geomap-hss-provider slot="mapControls" style-url="testStyleUrl"></ui5-geomap-hss-provider>`).as("geomapHssProvider");

            cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
                // Arrange
                const geomapHssProvider = $geomapHssProvider.get(0);
                const state = geomapHssProvider._state;

                // Assert
                expect(state["styleUrl"]).to.equal("testStyleUrl");
            });
        });
    });

    describe("test events", () => {
		it("tests attachChangeHandler, BGSOFUISAKAR-1248, BGSOFUISAKAR-1279", () => {
			cy.on('uncaught:exception', (err, runnable) => {
				return false;
			});
			cy.mount(html`<ui5-geomap>
				<ui5-geomap-hss-provider
					slot="mapControls"
					service-url="http://dummy"
					service-authentication-url="http://dummy"
					client-id="dummy-string"
					client-secret="dummy-string"
					style-url="https://dummy">
					</ui5-geomap-hss-provider>
				</ui5-geomap>`).as("geomap");

			cy.get("@geomap").then(($geomap) => {
				const geoMapDom = $geomap.get(0);
				const geomapHssProvider = geoMapDom.mapControls[0];
				const callback = () => {
				};
				geomapHssProvider.attachChangeHandler(callback);
				geomapHssProvider.addEventListener("update", cy.stub().as("update"))
				geomapHssProvider.fireDecoratorEvent("update");
				geomapHssProvider.detachChangeHandler(callback);

				cy.get("@update")
					.should("have.been.called");
			});
		});
	});

    describe("test methods", () => {
		cy.on('uncaught:exception', (err, runnable) => {
			return false;
		});
        it("tests isValidConfiguration default, BGSOFUISAKAR-1248", () => {
            cy.mount(html`<ui5-geomap-hss-provider
                slot="mapControls"
				service-url=""
				service-authentication-url=""
				client-id=""
				client-secret=""
				style-url="">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

            cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
                // Arrange
                const geomapHssProvider = $geomapHssProvider.get(0);
				const isValidConfiguration = geomapHssProvider.isValidConfiguration();
                // Assert
                expect(isValidConfiguration).to.equal(false);
            });
        });

		it("tests isValidConfiguration - available, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
                slot="mapControls"
				service-url="http://dummy"
				service-authentication-url="http://dummy"
				client-id="dummy-string"
				client-secret="dummy-string"
				style-url="https://dummy">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				// Arrange
				const geomapHssProvider = $geomapHssProvider.get(0);
				const isValidConfiguration = geomapHssProvider.isValidConfiguration();
				// Assert
				expect(isValidConfiguration).to.equal(true);
			});
		});

		it("tests isValidConfiguration - available with empty styleUrl, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
                slot="mapControls"
				service-url="http://dummy"
				service-authentication-url="http://dummy"
				client-id="dummy-string"
				client-secret="dummy-string"
				style-url="">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				// Arrange
				const geomapHssProvider = $geomapHssProvider.get(0);
				const isValidConfiguration = geomapHssProvider.isValidConfiguration();
				// Assert
				expect(isValidConfiguration).to.equal(true);
			});
		});

		it("tests isValidConfiguration - available with empty styleUrl & set object as styleUrl, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
                slot="mapControls"
				service-url="http://dummy"
				service-authentication-url="http://dummy"
				client-id="dummy-string"
				client-secret="dummy-string"
				style-url="">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				// Arrange
				const geomapHssProvider = $geomapHssProvider.get(0);

				const rasterStyles = {
					"version": 8,
					"sources": {
						"raster-tiles": {
							"type": "raster",
							"tiles": [
								"https://spatialservices.cfapps.sap.hana.ondemand.com/mapping/v1/here/tiles/maptile/newest/normal.day/{z}/{x}/{y}/256/png"
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

				// Act
				geomapHssProvider.styleUrl = rasterStyles;

				const isValidConfiguration = geomapHssProvider.isValidConfiguration();
				// Assert
				expect(isValidConfiguration).to.equal(true);
			});
		});

		it("tests isValidStyleUrl, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
				slot="mapControls"
				service-url="http://dummy"
				service-authentication-url="http://dummy"
				client-id="dummy-string"
				client-secret="dummy-string"
				style-url="">
			</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				// Arrange
				const geomapHssProvider = $geomapHssProvider.get(0);

				const rasterStyles = {
					"version": 8,
					"sources": {
						"raster-tiles": {
							"type": "raster",
							"tiles": [
								"https://spatialservices.cfapps.sap.hana.ondemand.com/mapping/v1/here/tiles/maptile/newest/normal.day/{z}/{x}/{y}/256/png"
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

				let bIsValid = geomapHssProvider.isValidStyleUrl();
				// Assert
				expect(bIsValid).to.equal(false);

				bIsValid = geomapHssProvider.isValidStyleUrl(rasterStyles);
				// Assert
				expect(bIsValid).to.equal(true);

				bIsValid = geomapHssProvider.isValidStyleUrl("https://dummyUrl.com");
				// Assert
				expect(bIsValid).to.equal(true);

				bIsValid = geomapHssProvider.isValidStyleUrl("dummy");
				// Assert
				expect(bIsValid).to.equal(false);
			});
		});

		it("tests handleInvalidation, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
                slot="mapControls"
				service-url=""
				service-authentication-url=""
				client-id=""
				client-secret=""
				style-url="">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				// Arrange
				const geomapHssProvider = $geomapHssProvider.get(0);
				const spy = cy.spy(geomapHssProvider, "_fetchToken");
				geomapHssProvider.handleInvalidation({type: "property"});
				// Assert
				expect(spy.callCount).to.equal(1);
			});
		});

		it("tests isTokenValid, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
                slot="mapControls"
				service-url=""
				service-authentication-url=""
				client-id=""
				client-secret=""
				style-url="">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				// Arrange
				const geomapHssProvider = $geomapHssProvider.get(0);
				const valid = geomapHssProvider.isTokenValid({type: "property"});
				// Assert
				expect(valid).to.equal(false);
			});
		});

		it("tests getStyle, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
                slot="mapControls"
				service-url=""
				service-authentication-url=""
				client-id=""
				client-secret=""
				style-url="http://dummy">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				// Arrange
				const geomapHssProvider = $geomapHssProvider.get(0);
				const style = geomapHssProvider.getStyle();
				// Assert
				expect(style).to.equal("");
			});
		});

		it("tests getStyle, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
				slot="mapControls"
				service-url="http://dummy"
				service-authentication-url="http://dummy"
				client-id="dummy-string"
				client-secret="dummy-string"
				style-url="https://dummy">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				// Arrange
				const geomapHssProvider = $geomapHssProvider.get(0);
				const style = geomapHssProvider.getStyle();
				// Assert
				expect(style).to.equal("https://dummy");
			});
		});

		it("tests _fetchToken, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
				slot="mapControls"
				service-url=""
				service-authentication-url=""
				client-id=""
				client-secret=""
				style-url="http://dummy">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				const geomapHssProvider = $geomapHssProvider.get(0);

				geomapHssProvider._fetchToken().catch((e) => {
					expect(e.message).to.equal("Missing config or possible misconfiguration.");
				});
			});
		});

		it("tests transformRequest, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
				slot="mapControls"
				service-url=""
				service-authentication-url=""
				client-id=""
				client-secret=""
				style-url="http://dummy">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				const geomapHssProvider = $geomapHssProvider.get(0);
				let res;

				res = geomapHssProvider.transformRequest("dummy");
				expect(res.url).to.equal("dummy");

				geomapHssProvider.sToken = "dummyToken";
				geomapHssProvider.serviceUrl = "dummy";
				res = geomapHssProvider.transformRequest("dummy");
				expect(res.url).to.equal("dummy");
				expect(res.headers.Authorization).to.exist;
				expect(res.headers.Authorization).to.equal("Bearer dummyToken");
			});
		});

		it("tests createTokenExpiryDate, BGSOFUISAKAR-1248", () => {
			cy.mount(html`<ui5-geomap-hss-provider
				slot="mapControls"
				service-url=""
				service-authentication-url=""
				client-id=""
				client-secret=""
				style-url="http://dummy">
				</ui5-geomap-hss-provider>`).as("geomapHssProvider");

			cy.get("@geomapHssProvider").then(($geomapHssProvider) => {
				const geomapHssProvider = $geomapHssProvider.get(0);
				let res;

				res = geomapHssProvider.createTokenExpiryDate(10);
				expect(res).to.exist;
			});
		});
    });
})
