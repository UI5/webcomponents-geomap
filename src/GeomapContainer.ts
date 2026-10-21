import jsxRenderer from "@ui5/webcomponents-base/dist/renderer/JsxRenderer.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import slot from "@ui5/webcomponents-base/dist/decorators/slot.js";
import { LngLat, Marker } from "./MapLibre.js";
import type { MarkerOptions } from "./MapLibre.js";
import GeomapMarkerBase from "./GeomapMarkerBase.js";
import GeomapContainerTemplate from "./GeomapContainerTemplate.js";

// @ts-ignore
import type Map from "./extensions/Map.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-container` defines the Container webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapContainer.js";`
 *
 * @constructor
 * @extends GeomapMarkerBase
 * @public
 */
@customElement({
	tag: "ui5-geomap-container",
	template: GeomapContainerTemplate,
	renderer: jsxRenderer,
})

class GeomapContainer extends GeomapMarkerBase {
	/**
	* Content
	*
	* @public
	*/
	@slot({ type: HTMLElement, "default": true })
	content!: Array<HTMLElement>;
	lat!: number;
	lng!: number;
	_markerInstance!: Marker | null;

	/**
	 * Anchor point of the container element relative to the geographic coordinate.
	 * Determines which part of the container element is placed at the exact lng/lat position.
	 * Use "bottom-left" (default) so the container content sits above and to the right of the pin point.
	 * Accepted values: "center", "top", "bottom", "left", "right",
	 * "top-left", "top-right", "bottom-left", "bottom-right".
	 * @default "bottom-left"
	 * @public
	 */
	@property({ type: String })
	anchor: MarkerOptions["anchor"] = "bottom-left";

	constructor() {
		super();
		this._individualSlot = "";
	}

	/**
	* @override
	*/
	createMarkerInstance(): Marker {
		const wrapper = document.createElement("div");
		const slotElement = document.createElement("slot");
		slotElement.name = this._individualSlot ?? "";
		wrapper.appendChild(slotElement);

		const marker = new Marker({
			draggable: false,
			element: wrapper,
			anchor: this.anchor,
			subpixelPositioning: true,
		}).setLngLat(new LngLat(this.lng, this.lat));

		return marker;
	}

	/**
	* @override
	* @param marker
	*/
	updateMarkerInstance(marker: Marker) {
		marker.setLngLat(new LngLat(this.lng, this.lat));
		marker.getElement().querySelector("slot")!.name = this._individualSlot ?? "";
	}

	handleInvalidation(changeInfo: { type: string; name: string }) {
		// anchor cannot be updated on an existing MapLibre Marker; recreate it.
		if (changeInfo.type === "property" && changeInfo.name === "anchor" && this._markerInstance) {
			const map = this.map;
			this._markerInstance.remove();
			this._markerInstance = null;
			if (map) {
				this.markerInstance.addTo(map);
			}
		}
	}

	connectToMap(map: Map) {
		super.connectToMap(map);
		const markerInstance = this._markerInstance?.getElement()?.querySelector("slot");
		if (markerInstance) {
			markerInstance.name = this._individualSlot ?? "";
		}
	}

	getFocusDomRef(): HTMLElement {
		return this.markerInstance?.getElement();
	}
}

GeomapContainer.define();

export default GeomapContainer;
