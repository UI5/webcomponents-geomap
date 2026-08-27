import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import type { MarkerOptions } from "./MapLibre.js";
import { Marker, LngLat } from "./MapLibre.js";
import GeomapMarkerBase from "./GeomapMarkerBase.js";
import GeomapSpotComponent from "./GeomapSpotComponent.js";
import { PulseAnimationUtil } from "./utils/PulseAnimationUtil.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-spot` defines the Spot webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapSpot.js";`
 *
 * @constructor
 * @extends GeomapMarkerBase
 * @experimental
 * @public
 */
@customElement({
	tag: "ui5-geomap-spot",
})
/**
 * Fired once the spot is clicked.
 * @public
 */
@event("click", { cancelable: true })

/**
 * Fired on double-click of the spot.
 * @public
 */
@event("double-click")

/**
 * Fired on right-click of the spot.
 * @public
 */
@event("right-click", { cancelable: true })

/**
 * Fired on mouseover of the spot.
 * @public
 */
@event("mouseover")

/**
 * Fired on mouseout of the spot.
 * @public
 */
@event("mouseout")

class GeomapSpot extends GeomapMarkerBase {
	eventDetails!: {
		"click": MouseEvent;
		"double-click": void;
		"right-click": MouseEvent;
		"mouseover": void;
		"mouseout": void;
	}
	/**
	 * Describes if the spot is draggable.
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	draggable = false;

	/**
	 * Icon of the spot displayed on the map.
	 * @default "map"
	 * @public
	 */
	@property({ type: String })
	icon = "map";
	/**
	 * Width of the spot displayed on the map.
	 * @default "2rem"
	 * @public
	 */
	@property({ type: String })
	width = "2rem";

	/**
	 * Height of the spot displayed on the map.
	 * @default "2rem"
	 * @public
	 */
	@property({ type: String })
	height = "2rem";

	/**
	 * Opacity of the spot displayed on the map.
	 * @default "1"
	 * @public
	 */
	@property({ type: String })
	opacity = "1";

	/**
	 * Color of the spot displayed on the map.
	 * @default ""
	 * @public
	 */
	@property({ type: String })
	color = "";

	/**
	 * Anchor point of the marker element relative to the geographic coordinate.
	 * Determines which part of the marker element is placed at the exact lng/lat position.
	 * Use "bottom" (default) so the tip of a pin icon points to the coordinate.
	 * Accepted values: "center", "top", "bottom", "left", "right",
	 * "top-left", "top-right", "bottom-left", "bottom-right".
	 * @default "bottom"
	 * @public
	 */
	@property({ type: String })
	anchor: MarkerOptions["anchor"] = "bottom";

	/**
	 * @override
	 */
	createMarkerInstance(): Marker {
		const options: MarkerOptions = {};
		options.draggable = this.draggable;
		options.anchor = this.anchor;
		options.subpixelPositioning = true;

		const spotComponent = new GeomapSpotComponent();
		spotComponent.icon = this.icon;
		spotComponent.width = this.width;
		spotComponent.height = this.height;
		spotComponent.opacity = this.opacity;
		spotComponent.color = this.color;
		spotComponent.lng = this.lng;
		spotComponent.lat = this.lat;
		// Set explicit dimensions so MapLibre can calculate the anchor offset before the shadow DOM renders.
		spotComponent.style.width = this.width;
		spotComponent.style.height = this.height;
		spotComponent.style.display = "block";
		options.element = spotComponent;

		spotComponent.addEventListener("click", e => {
			const prevented = !this.fireDecoratorEvent("click", e);
			if (prevented) {
				e.preventDefault();
				e.stopPropagation();
			}
		});
		spotComponent.addEventListener("contextmenu", e => {
			const prevented = !this.fireDecoratorEvent("right-click", e);
			if (prevented) {
				e.preventDefault();
				e.stopPropagation();
			}
		});
		const marker = new Marker(options)
			.setLngLat(new LngLat(this.lng, this.lat));

		this._updateAriaAttributes(marker.getElement());

		marker.on("dragend", () => {
			const center = marker.getLngLat();
			this.lng = center.lng;
			this.lat = center.lat;
		});

		return marker;
	}

	/**
	 * @override
	 * @param marker
	 */
	updateMarkerInstance(marker: Marker) {
		marker.setLngLat(new LngLat(this.lng, this.lat)).setDraggable(this.draggable);
		// Sync visual properties on the spot component without recreating the marker.
		const spotComponent = marker.getElement() as GeomapSpotComponent;
		if (spotComponent) {
			spotComponent.icon = this.icon;
			spotComponent.width = this.width;
			spotComponent.height = this.height;
			spotComponent.opacity = this.opacity;
			spotComponent.color = this.color;
			spotComponent.style.width = this.width;
			spotComponent.style.height = this.height;
		}
	}

	handleInvalidation(changeInfo: { type: string; name: string }) {
		// anchor cannot be updated on an existing MapLibre Marker;
		if (changeInfo.type === "property" && changeInfo.name === "anchor" && this._markerInstance) {
			const map = this.map;
			this._markerInstance.remove();
			this._markerInstance = null;
			if (map) {
				this.markerInstance.addTo(map);
			}
		}
	}

	_updateAriaAttributes(markerElement: HTMLElement) {
		markerElement.setAttribute("aria-label", "Spot marker");
		markerElement.setAttribute("role", "img");
	}

	getFocusDomRef(): HTMLElement {
		return this.markerInstance?.getElement();
	}

	/**
	 * Triggers a pulsing circle animation around the spot for 5 seconds.
	 * The animation shows a circle with border that expands and fades out.
	 * @param direction Inside-Out or reverse
	 */
	triggerPulseAnimation(direction: 0 | 1 = 1) {
		PulseAnimationUtil.triggerPulseAnimation(this.map, {
			lng: this.lng,
			lat: this.lat,
			direction,
		});
	}
}

GeomapSpot.define();

export default GeomapSpot;
