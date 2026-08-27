import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import jsxRenderer from "@ui5/webcomponents-base/dist/renderer/JsxRenderer.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import GeomapContainerControl from "./GeomapContainerControl.js";
import GeomapLegendControlTemplate from "./GeomapLegendControlTemplate.js";
import GeomapLegendControlCss from "./generated/themes/GeomapLegendControl.css.js";

interface LegendItem {
	id: string;
	icon?: string;
	label: string;
	color: string;
}

type LegendToggleEventDetail = {
	expanded: boolean;
};

type LegendItemClickEventDetail = {
	item: LegendItem;
};

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-legend-control` displays a legend on the map with configurable items.
 * It extends `ui5-geomap-container-control` and provides a pre-built UI for map legends.
 *
 * ### Usage
 *
 * ```html
 * <ui5-geomap-legend-control
 *   slot="mapControls"
 *   position="BottomRight"
 *   header-title="Map Legend"
 *   expanded
 * ></ui5-geomap-legend-control>
 * ```
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapLegendControl.js";`
 *
 * @constructor
 * @extends GeomapContainerControl
 * @experimental
 * @public
 */
@customElement({
	tag: "ui5-geomap-legend-control",
	template: GeomapLegendControlTemplate,
	styles: [GeomapLegendControlCss],
	renderer: jsxRenderer,
})

/**
 * Fired when legend is expanded/collapsed.
 *
 * @public
 */
@event("toggle")

/**
 * Fired when a legend item is clicked.
 *
 * @public
 */
@event("item-click")

class GeomapLegendControl extends GeomapContainerControl {
	eventDetails!: GeomapContainerControl["eventDetails"] & {
		"toggle": LegendToggleEventDetail;
		"item-click": LegendItemClickEventDetail;
	};

	/**
	 * Defines the header title of the legend panel.
	 *
	 * @default "Legend"
	 * @public
	 */
	@property()
	headerTitle: string = "Legend";

	/**
	 * Whether the legend panel is expanded.
	 *
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	expanded: boolean = false;

	/**
	 * Whether the legend is hidden.
	 *
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	hidden: boolean = false;

	/**
	 * Whether the legend can be dragged/moved on the map.
	 *
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	draggable: boolean = false;

	/**
	 * The legend items to display.
	 *
	 * @public
	 */
	@property({ type: Array })
	items: Array<LegendItem> = [];

	/**
	 * Returns whether the legend has items.
	 */
	get hasItems(): boolean {
		return this.items.length > 0;
	}

	/**
	 * Toggles the expanded state of the legend control and fires a "toggle" event.
	 */
	toggle(): void {
		this.expanded = !this.expanded;
		this.fireDecoratorEvent("toggle", { expanded: this.expanded } as LegendToggleEventDetail);
	}

	/**
	 * Handles a click on a legend item and fires the "item-click" event.
	 */
	onItemClick(item: LegendItem): void {
		this.fireDecoratorEvent("item-click", { item } as LegendItemClickEventDetail);
	}

	/**
	 * Hides the legend.
	 */
	hide(): void {
		this.hidden = true;
	}

	/**
	 * Shows the legend.
	 */
	show(): void {
		this.hidden = false;
	}

	_dragOffset: { x: number; y: number } = { x: 0, y: 0 };
	_dragStart: { x: number; y: number } = { x: 0, y: 0 };
	_isDragging: boolean = false;
	_hasDragged: boolean = false;
	/** Position relative to the map container's top-left corner (in px). */
	_mapRelativePos: { x: number; y: number } | null = null;
	_onMouseDown: ((e: MouseEvent) => void) | null = null;
	_onMouseMove: ((e: MouseEvent) => void) | null = null;
	_onMouseUp: (() => void) | null = null;
	_onTouchStart: ((e: TouchEvent) => void) | null = null;
	_onTouchMove: ((e: TouchEvent) => void) | null = null;
	_onTouchEnd: (() => void) | null = null;
	_resizeObserver: ResizeObserver | null = null;
	/** Which horizontal edge the legend is stuck to during resize, or null. */
	_stuckEdge: "left" | "right" | null = null;

	static readonly DRAG_THRESHOLD = 5;

	async onEnterDOM() {
		await super.onEnterDOM();
		this._attachDragAndDrop();
	}

	onExitDOM() {
		this._detachDragAndDrop();
		super.onExitDOM();
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		super.handleInvalidation(changeInfo);

		if (changeInfo.type === "property" && changeInfo.name === "draggable") {
			if (this.draggable) {
				this._attachDragAndDrop();
			} else {
				this._detachDragAndDrop();
			}
		}
	}

	/**
	 * Returns the legend's container element.
	 */
	get container(): HTMLDivElement | undefined {
		return this._instance?._container;
	}

	_getMapContainer(): HTMLElement | null {
		return this.map?.getContainer() ?? null;
	}

	/** The horizontal edge the legend should snap to based on its initial position. */
	get _snapEdge(): "left" | "right" {
		return this.position.includes("Right") ? "right" : "left";
	}

	_handlePointerStart(clientX: number, clientY: number, legendEl: HTMLElement): void {
		this._isDragging = true;
		this._hasDragged = false;
		this._dragStart = { x: clientX, y: clientY };

		const rect = legendEl.getBoundingClientRect();
		this._dragOffset = {
			x: clientX - rect.left,
			y: clientY - rect.top,
		};
	}

	_handlePointerMove(clientX: number, clientY: number, legendEl: HTMLElement): void {
		if (!this._isDragging) {
			return;
		}

		if (!this._hasDragged) {
			const dx = clientX - this._dragStart.x;
			const dy = clientY - this._dragStart.y;
			if (Math.abs(dx) < GeomapLegendControl.DRAG_THRESHOLD && Math.abs(dy) < GeomapLegendControl.DRAG_THRESHOLD) {
				return;
			}
			this._hasDragged = true;
			const rect = legendEl.getBoundingClientRect();
			legendEl.style.position = "fixed";
			legendEl.style.left = `${rect.left}px`;
			legendEl.style.top = `${rect.top}px`;
			legendEl.style.zIndex = "1000";
			legendEl.style.cursor = "grabbing";
		}

		const newLeft = clientX - this._dragOffset.x;
		const newTop = clientY - this._dragOffset.y;
		legendEl.style.left = `${newLeft}px`;
		legendEl.style.top = `${newTop}px`;

		const mapContainer = this._getMapContainer();
		if (mapContainer) {
			const mapRect = mapContainer.getBoundingClientRect();
			this._mapRelativePos = { x: newLeft - mapRect.left, y: newTop - mapRect.top };
		}
	}

	_handlePointerEnd(legendEl: HTMLElement): void {
		this._isDragging = false;
		legendEl.style.cursor = "grab";
		if (this._hasDragged) {
			this._clampToMapContainer(legendEl);
		}
	}

	_attachDragAndDrop(): void {
		const legendEl = this.container;
		if (!this.draggable || !legendEl) {
			return;
		}

		legendEl.style.cursor = "grab";

		// Mouse handlers
		this._onMouseDown = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			this._handlePointerStart(e.clientX, e.clientY, legendEl);
			document.addEventListener("mousemove", this._onMouseMove!);
			document.addEventListener("mouseup", this._onMouseUp!);
		};

		this._onMouseMove = (e: MouseEvent) => {
			this._handlePointerMove(e.clientX, e.clientY, legendEl);
		};

		this._onMouseUp = () => {
			this._handlePointerEnd(legendEl);
			document.removeEventListener("mousemove", this._onMouseMove!);
			document.removeEventListener("mouseup", this._onMouseUp!);
		};

		// Touch handlers
		this._onTouchStart = (e: TouchEvent) => {
			if (e.touches.length !== 1) {
				return;
			}
			const touch = e.touches[0];
			this._handlePointerStart(touch.clientX, touch.clientY, legendEl);
			document.addEventListener("touchmove", this._onTouchMove!, { passive: false });
			document.addEventListener("touchend", this._onTouchEnd!);
		};

		this._onTouchMove = (e: TouchEvent) => {
			if (e.touches.length !== 1) {
				return;
			}
			const touch = e.touches[0];
			if (this._hasDragged) {
				e.preventDefault();
			}
			this._handlePointerMove(touch.clientX, touch.clientY, legendEl);
			if (this._hasDragged) {
				e.preventDefault();
			}
		};

		this._onTouchEnd = () => {
			document.removeEventListener("touchmove", this._onTouchMove!);
			document.removeEventListener("touchend", this._onTouchEnd!);
			if (this._hasDragged) {
				this._handlePointerEnd(legendEl);
			} else {
				this._isDragging = false;
			}
		};

		legendEl.addEventListener("mousedown", this._onMouseDown);
		legendEl.addEventListener("touchstart", this._onTouchStart, { passive: false });

		const mapContainer = this._getMapContainer();
		if (mapContainer) {
			this._resizeObserver = new ResizeObserver(() => {
				if (this._hasDragged && !this._isDragging) {
					this._clampToMapContainer(legendEl, true);
				}
			});
			this._resizeObserver.observe(mapContainer);
		}
	}

	/**
	 * Clamps the legend so it stays fully inside the map container.
	 * During resize (`isResize = true`), the Y coordinate is preserved
	 * and the legend sticks to its snap edge (left or right, based on
	 * the initial `position`) once a collision is detected.
	 */
	_clampToMapContainer(legendEl: HTMLElement, isResize = false): void {
		const mapContainer = this._getMapContainer();
		if (!mapContainer) {
			return;
		}

		const mapRect = mapContainer.getBoundingClientRect();
		const elRect = legendEl.getBoundingClientRect();

		let left: number;
		let top: number;

		if (isResize && this._stuckEdge === "right") {
			left = mapRect.right - elRect.width;
			top = this._mapRelativePos ? mapRect.top + this._mapRelativePos.y : elRect.top;
		} else if (isResize && this._stuckEdge === "left") {
			left = mapRect.left;
			top = this._mapRelativePos ? mapRect.top + this._mapRelativePos.y : elRect.top;
		} else if (this._mapRelativePos) {
			left = mapRect.left + this._mapRelativePos.x;
			top = mapRect.top + this._mapRelativePos.y;
		} else {
			left = elRect.left;
			top = elRect.top;
		}

		const clampedLeft = Math.max(mapRect.left, Math.min(left, mapRect.right - elRect.width));
		const clampedTop = Math.max(mapRect.top, Math.min(top, mapRect.bottom - elRect.height));

		legendEl.style.left = `${clampedLeft}px`;
		legendEl.style.top = `${clampedTop}px`;

		if (isResize) {
			// Detect collision: clamping shifted the legend toward its snap edge
			if (clampedLeft !== left) {
				this._stuckEdge = this._snapEdge;
			}
			if (this._mapRelativePos) {
				this._mapRelativePos = { x: clampedLeft - mapRect.left, y: this._mapRelativePos.y };
			}
		} else {
			this._stuckEdge = null;
			this._mapRelativePos = { x: clampedLeft - mapRect.left, y: clampedTop - mapRect.top };
		}
	}

	_detachDragAndDrop(): void {
		const legendEl = this.container;
		if (!legendEl) {
			return;
		}

		legendEl.style.cursor = "";

		if (this._onMouseDown) {
			legendEl.removeEventListener("mousedown", this._onMouseDown);
		}
		if (this._onMouseMove) {
			document.removeEventListener("mousemove", this._onMouseMove);
		}
		if (this._onMouseUp) {
			document.removeEventListener("mouseup", this._onMouseUp);
		}
		if (this._onTouchStart) {
			legendEl.removeEventListener("touchstart", this._onTouchStart);
		}
		if (this._onTouchMove) {
			document.removeEventListener("touchmove", this._onTouchMove);
		}
		if (this._onTouchEnd) {
			document.removeEventListener("touchend", this._onTouchEnd);
		}

		this._onMouseDown = null;
		this._onMouseMove = null;
		this._onMouseUp = null;
		this._onTouchStart = null;
		this._onTouchMove = null;
		this._onTouchEnd = null;

		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}
	}
}

GeomapLegendControl.define();

export default GeomapLegendControl;
export type {
	LegendToggleEventDetail,
	LegendItemClickEventDetail,
	LegendItem,
};
