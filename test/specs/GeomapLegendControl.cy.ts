import type GeomapLegendControl from "../../src/GeomapLegendControl.js";
import type { LegendItem } from "../../src/GeomapLegendControl.js";
import "../../src/GeomapLegendControl.js";

describe("ui5-geomap-legend-control", () => {
	const mockItems: LegendItem[] = [
		{ id: "1", label: "> 20 millions", color: "#723122", icon: "status-critical" },
		{ id: "2", label: "12M - 20M", color: "#8B4225" },
		{ id: "3", label: "9M - 12M", color: "#A25626" },
		{ id: "4", label: "5M - 7M", color: "#CA8323", icon: "status-positive" },
	];

	function mountLegend(props: Partial<{
		headerTitle: string;
		expanded: boolean;
		hidden: boolean;
		draggable: boolean;
		items: LegendItem[];
	}> = {}) {
		const attrs: string[] = [];

		if (props.headerTitle) {
			attrs.push(`header-title="${props.headerTitle}"`);
		}
		if (props.expanded) {
			attrs.push("expanded");
		}
		if (props.hidden) {
			attrs.push("hidden");
		}
		if (props.draggable) {
			attrs.push("draggable");
		}

		cy.mount(
			`<ui5-geomap-legend-control ${attrs.join(" ")}></ui5-geomap-legend-control>`
		);

		if (props.items) {
			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				el.items = props.items!;
			});
		}
	}

	describe("test properties", () => {
		it("tests default rendering", () => {
			// Arrange
			mountLegend();

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-control")
				.should("exist");

			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find("[ui5-panel]")
				.should("exist");
		});

		it("tests headerTitle property", () => {
			// Arrange
			mountLegend({ headerTitle: "Population", expanded: true });

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-header-title")
				.should("contain.text", "Population");
		});

		it("tests empty items message", () => {
			// Arrange
			mountLegend({ expanded: true, items: [] });

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-empty")
				.should("exist")
				.and("contain.text", "No legend items");
		});

		it("tests items rendering", () => {
			// Arrange
			mountLegend({ expanded: true, items: mockItems });

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-list")
				.should("exist");

			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-item")
				.should("have.length", mockItems.length);
		});

		it("tests color swatch rendering", () => {
			// Arrange
			mountLegend({ expanded: true, items: [mockItems[1]] });

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-color-swatch")
				.should("exist")
				.and("have.css", "background-color");
		});

		it("tests icon rendering", () => {
			// Arrange
			mountLegend({ expanded: true, items: [mockItems[0]] });

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find("[ui5-icon]")
				.should("exist")
				.and("have.attr", "name", "status-critical");
		});

		it("tests item label rendering", () => {
			// Arrange
			mountLegend({ expanded: true, items: [mockItems[0]] });

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-label")
				.should("contain.text", mockItems[0].label);
		});

		it("tests mixed icons and swatches rendering", () => {
			// Arrange
			mountLegend({ expanded: true, items: mockItems });

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find("[ui5-icon]")
				.should("have.length", 2);

			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-color-swatch")
				.should("have.length", 2);
		});

		it("tests expanded property default", () => {
			// Arrange
			mountLegend({ items: mockItems });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el.expanded).to.equal(false);
			});
		});

		it("tests expanded property", () => {
			// Arrange
			mountLegend({ expanded: true, items: mockItems });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el.expanded).to.equal(true);
			});
		});

		it("tests hidden property default", () => {
			// Arrange
			mountLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el.hidden).to.equal(false);
			});
		});

		it("tests hidden property class", () => {
			// Arrange
			mountLegend({ hidden: true });

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-control--hidden")
				.should("exist");
		});

		it("tests hidden class default", () => {
			// Arrange
			mountLegend();

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-control--hidden")
				.should("not.exist");
		});

		it("tests draggable property default", () => {
			// Arrange
			mountLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el.draggable).to.equal(false);
			});
		});

		it("tests draggable property", () => {
			// Arrange
			mountLegend({ draggable: true });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el.draggable).to.equal(true);
			});
		});

		it("tests drag state properties", () => {
			// Arrange
			mountLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el._isDragging).to.equal(false);
				expect(el._dragOffset).to.deep.equal({ x: 0, y: 0 });
			});
		});

		it("tests headerTitle default", () => {
			// Arrange
			mountLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el.headerTitle).to.equal("Legend");
			});
		});

		it("tests items property default", () => {
			// Arrange
			mountLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el.items).to.be.an("array");
				expect(el.items).to.have.length(0);
			});
		});

		it("tests hasItems property", () => {
			// Arrange
			mountLegend({ items: [] });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el.hasItems).to.equal(false);

				// Act
				el.items = mockItems;
				// Assert
				expect(el.hasItems).to.equal(true);
			});
		});
	});

	describe("test methods", () => {
		it("tests toggle method", () => {
			// Arrange
			mountLegend({ items: mockItems });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				expect(el.expanded).to.equal(false);

				// Act
				el.toggle();
				// Assert
				expect(el.expanded).to.equal(true);

				// Act
				el.toggle();
				expect(el.expanded).to.equal(false);
			});
		});

		it("tests items dynamic update", () => {
			// Arrange
			mountLegend({ expanded: true, items: mockItems });

			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-item")
				.should("have.length", 4);

			// Act
			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				el.items = [mockItems[0], mockItems[1]];
			});

			// Assert
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-item")
				.should("have.length", 2);
		});

		it("tests hide method", () => {
			// Arrange
			mountLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Act
				el.hide();

				// Assert
				expect(el.hidden).to.equal(true);
			});

			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-control--hidden")
				.should("exist");
		});

		it("tests show method", () => {
			// Arrange
			mountLegend({ hidden: true });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Act
				el.show();

				// Assert
				expect(el.hidden).to.equal(false);
			});

			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-control--hidden")
				.should("not.exist");
		});

		it("tests hide and show methods", () => {
			// Arrange
			mountLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Act & Assert
				el.hide();
				expect(el.hidden).to.equal(true);

				el.show();
				expect(el.hidden).to.equal(false);
			});
		});
	});

	describe("test events", () => {
		it("tests item-click event to be fired when a legend item is clicked", () => {
			mountLegend({ expanded: true, items: mockItems });

			// Arrange
			const clickSpy = cy.spy().as("itemClickSpy");

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				el.addEventListener("item-click", clickSpy);
			});

			// Act
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-item")
				.first()
				.click({ force: true })
				.then(() => {
					// Assert
					expect(clickSpy.calledOnce).to.equal(true);
					expect(clickSpy.firstCall.args[0].detail).to.deep.include({ item: mockItems[0] });
				});
		});

		it("tests item-click event detail - should be fired with correct item", () => {
			mountLegend({ expanded: true, items: mockItems });

			// Arrange
			const clickSpy = cy.spy().as("itemClickSpy");

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				el.addEventListener("item-click", clickSpy);
			});

			// Act
			cy.get("ui5-geomap-legend-control")
				.shadow()
				.find(".legend-item")
				.eq(2)
				.click({ force: true })
				.then(() => {
					// Assert
					expect(clickSpy.firstCall.args[0].detail).to.deep.include({ item: mockItems[2] });
				});
		});

		it("tests onItemClick method - should fire item-click event with correct item", () => {
			mountLegend({ expanded: true, items: mockItems });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Arrange
				const clickSpy = cy.spy().as("itemClickSpy");
				el.addEventListener("item-click", clickSpy);

				// Act
				el.onItemClick(mockItems[1]);

				// Assert
				expect(clickSpy.calledOnce).to.equal(true);
				expect(clickSpy.firstCall.args[0].detail).to.deep.include({ item: mockItems[1] });
			});
		});

		it("tests toggle event", () => {
			mountLegend({ items: mockItems });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Arrange
				const toggleSpy = cy.spy().as("toggleSpy");
				el.addEventListener("toggle", toggleSpy);

				// Act
				el.toggle();

				// Assert
				expect(toggleSpy.calledOnce).to.equal(true);
				expect(toggleSpy.firstCall.args[0].detail).to.deep.include({ expanded: true });
			});
		});

		it("tests toggle event on collapse", () => {
			mountLegend({ expanded: true, items: mockItems });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Arrange
				const toggleSpy = cy.spy().as("toggleSpy");
				el.addEventListener("toggle", toggleSpy);

				// Act
				el.toggle();

				// Assert
				expect(toggleSpy.calledOnce).to.equal(true);
				expect(toggleSpy.firstCall.args[0].detail).to.deep.include({ expanded: false });
			});
		});
	});

	describe("test draggable behavior", () => {
		/**
		 * Mounts a standalone legend with a mocked _instance._container
		 * and map container so _attachDragAndDrop() works without MapLibre.
		 */
		function mountDraggableLegend(position: string = "TopRight") {
			mountLegend({ draggable: true, expanded: true, headerTitle: "Legend" });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const legend = $el[0] as GeomapLegendControl;
				legend.position = position as any;

				const mapContainer = document.createElement("div");
				mapContainer.style.cssText = "position:relative;width:800px;height:600px;";
				document.body.appendChild(mapContainer);

				const legendEl = document.createElement("div");
				legendEl.className = "maplibregl-ctrl";
				legendEl.style.cssText = "position:absolute;width:150px;height:200px;right:10px;top:10px;";
				mapContainer.appendChild(legendEl);

				legend._instance = { _container: legendEl } as any;
				legend._getMapContainer = () => mapContainer;
				legend._attachDragAndDrop();
			});
		}

		afterEach(() => {
			cy.get("ui5-geomap-legend-control").then(($el) => {
				const mapContainer = ($el[0] as GeomapLegendControl)._getMapContainer();
				mapContainer?.parentElement?.removeChild(mapContainer);
			});
		});

		it("tests that dragging moves the legend", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;
				const startLeft = rect.left;

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX + 100, clientY: startY + 50, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

				// Assert
				expect(legendEl.getBoundingClientRect().left).to.not.equal(startLeft);
			});
		});

		it("tests that _hasDragged is true after drag", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX + 100, clientY: startY + 50, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

				// Assert
				expect(el._hasDragged).to.equal(true);
			});
		});

		it("tests that small mouse movement does not trigger drag", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX + 2, clientY: startY + 2, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

				// Assert
				expect(el._hasDragged).to.equal(false);
			});
		});

		it("tests that legend is clamped inside map container after drag", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX + 2000, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

				// Assert
				const mapRect = el._getMapContainer()!.getBoundingClientRect();
				expect(legendEl.getBoundingClientRect().right).to.be.at.most(mapRect.right + 1);
			});
		});

		it("tests that _stuckEdge is null after dragging toward center", () => {
			// Arrange
			mountDraggableLegend("TopRight");

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX - 200, clientY: startY + 100, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

				// Assert
				expect(el._stuckEdge).to.equal(null);
			});
		});

		it("tests that _snapEdge returns 'right' for TopRight position", () => {
			// Arrange
			mountDraggableLegend("TopRight");

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el._snapEdge).to.equal("right");
			});
		});

		it("tests that _snapEdge returns 'left' for TopLeft position", () => {
			// Arrange
			mountDraggableLegend("TopLeft");

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el._snapEdge).to.equal("left");
			});
		});

		it("tests that _mapRelativePos is set after drag", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX - 100, clientY: startY + 50, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

				// Assert
				expect(el._mapRelativePos).to.not.equal(null);
				expect(el._mapRelativePos!.x).to.be.a("number");
				expect(el._mapRelativePos!.y).to.be.a("number");
			});
		});

		it("tests that _stuckEdge is cleared after a new drag", () => {
			// Arrange
			mountDraggableLegend("TopRight");

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Simulate stuck state
				el._stuckEdge = "right";

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX - 50, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

				// Assert
				expect(el._stuckEdge).to.equal(null);
			});
		});

		it("tests that dragging sets fixed position on legend element", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX + 100, clientY: startY + 50, bubbles: true }));

				// Assert
				expect(legendEl.style.position).to.equal("fixed");

				// Cleanup
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
			});
		});

		it("tests _clampToMapContainer preserves Y during resize", () => {
			// Arrange
			mountDraggableLegend("TopRight");

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new MouseEvent("mousedown", { clientX: startX, clientY: startY, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mousemove", { clientX: startX - 200, clientY: startY + 150, bubbles: true }));
				document.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));

				const yAfterDrag = el._mapRelativePos!.y;

				// Act
				el._clampToMapContainer(legendEl, true);

				// Assert
				expect(el._mapRelativePos!.y).to.equal(yAfterDrag);
			});
		});
	});

	describe("test touch draggable behavior", () => {
		function createTouch(target: EventTarget, clientX: number, clientY: number): Touch {
			return new Touch({
				identifier: 0,
				target,
				clientX,
				clientY,
			});
		}

		function mountDraggableLegend(position: string = "TopRight") {
			mountLegend({ draggable: true, expanded: true, headerTitle: "Legend" });

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const legend = $el[0] as GeomapLegendControl;
				legend.position = position as any;

				const mapContainer = document.createElement("div");
				mapContainer.style.cssText = "position:relative;width:800px;height:600px;";
				document.body.appendChild(mapContainer);

				const legendEl = document.createElement("div");
				legendEl.className = "maplibregl-ctrl";
				legendEl.style.cssText = "position:absolute;width:150px;height:200px;right:10px;top:10px;";
				mapContainer.appendChild(legendEl);

				legend._instance = { _container: legendEl } as any;
				legend._getMapContainer = () => mapContainer;
				legend._attachDragAndDrop();
			});
		}

		afterEach(() => {
			cy.get("ui5-geomap-legend-control").then(($el) => {
				const mapContainer = ($el[0] as GeomapLegendControl)._getMapContainer();
				mapContainer?.parentElement?.removeChild(mapContainer);
			});
		});

		it("tests that touch dragging moves the legend", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;
				const startLeft = rect.left;

				// Act
				legendEl.dispatchEvent(new TouchEvent("touchstart", {
					touches: [createTouch(legendEl, startX, startY)],
					bubbles: true,
					cancelable: true,
				}));
				document.dispatchEvent(new TouchEvent("touchmove", {
					touches: [createTouch(legendEl, startX + 100, startY + 50)],
					bubbles: true,
					cancelable: true,
				}));
				document.dispatchEvent(new TouchEvent("touchend", {
					touches: [],
					changedTouches: [createTouch(legendEl, startX + 100, startY + 50)],
					bubbles: true,
				}));

				// Assert
				expect(legendEl.getBoundingClientRect().left).to.not.equal(startLeft);
			});
		});

		it("tests that multi-touch is ignored", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new TouchEvent("touchstart", {
					touches: [
						createTouch(legendEl, startX, startY),
						createTouch(legendEl, startX + 50, startY + 50),
					],
					bubbles: true,
					cancelable: true,
				}));

				// Assert
				expect(el._isDragging).to.equal(false);
			});
		});

		it("tests that tap without drag does not move the legend", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;
				const legendEl = el._instance!._container as HTMLElement;
				const rect = legendEl.getBoundingClientRect();
				const startX = rect.left + rect.width / 2;
				const startY = rect.top + rect.height / 2;

				// Act
				legendEl.dispatchEvent(new TouchEvent("touchstart", {
					touches: [createTouch(legendEl, startX, startY)],
					bubbles: true,
					cancelable: true,
				}));
				document.dispatchEvent(new TouchEvent("touchend", {
					touches: [],
					changedTouches: [createTouch(legendEl, startX, startY)],
					bubbles: true,
				}));

				// Assert
				expect(el._hasDragged).to.equal(false);
				expect(el._isDragging).to.equal(false);
			});
		});

		it("tests that touch listeners are cleaned up on detach", () => {
			// Arrange
			mountDraggableLegend();

			cy.get("ui5-geomap-legend-control").then(($el) => {
				const el = $el[0] as GeomapLegendControl;

				// Assert
				expect(el._onTouchStart).to.not.equal(null);
				expect(el._onTouchMove).to.not.equal(null);
				expect(el._onTouchEnd).to.not.equal(null);

				// Act
				el._detachDragAndDrop();

				// Assert
				expect(el._onTouchStart).to.equal(null);
				expect(el._onTouchMove).to.equal(null);
				expect(el._onTouchEnd).to.equal(null);
			});
		});
	});
});
