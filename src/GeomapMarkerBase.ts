import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { Marker } from "./MapLibre.js";
import GeomapElement from "./GeomapElement.js";

/**
 * @class
 *
 * Base class for all marker-based components (spot and container)
 *
 * <h3>Usage</h3>
 *
 * <h3>CSS Shadow Parts</h3>
 *
 * <h3>ES6 Module Import</h3>
 *
 * @constructor
 * @extends GeomapElement
 * @experimental
 * @public
 */
class GeomapMarkerBase extends GeomapElement {
	/**
	* Longitude of the marker.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	lng = 0;

	/**
	* Latitude of the marker.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	lat = 0;

	_markerInstance: Marker | null;
	marker: Marker | undefined;

	constructor() {
		super();
		this._markerInstance = null;
		this.attachInvalidate(this.handleInvalidation.bind(this));
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	handleInvalidation(_changeInfo: { type: string; name: string }) {
	}

	get markerInstance() {
		if (!this._markerInstance) {
			this._markerInstance = this.createMarkerInstance();
		}

		return this._markerInstance as Marker;
	}

	onBeforeRendering() {
		this.updateMarkerInstance(this.markerInstance);
	}

	async onEnterDOM() {
		await this.whenMapConnected();
		if (this.map) {
			this.markerInstance.addTo(this.map);
		}
	}

	onExitDOM() {
		if (this.map) {
			if (this._markerInstance) {
				this._markerInstance.remove();
				this._markerInstance = null;
			}
		}
		super.onExitDOM();
	}

	createMarkerInstance(): Marker | null {
		return null;
	}

	// get classes(): ClassMap {
	// 	return {};
	// }

	updateMarkerInstance(marker: Marker): void {
		this.marker = marker;
	}
}

export default GeomapMarkerBase;
