import type { ControlPosition, IControl, MapOptions } from "../MapLibre.js";
import { Marker, Map as mapLibMap } from "../MapLibre.js";

class Map extends mapLibMap {
	private _helperMarkers: { hover: Marker; click: Marker; } | undefined;
	constructor(options: MapOptions) {
		super(options);
		this.createHelperMarkers();
	}

	/**
	 * Returns a helper markers.
	 */
	createHelperMarkers() {
		const clickMarker = new Marker({
			element: document.createElement("span"),
		}).setLngLat([0, 0]).addTo(this);

		const hoverMarker = new Marker({
			element: document.createElement("span"),
		}).setLngLat([0, 0]).addTo(this);

		this._helperMarkers = {
			click: clickMarker,
			hover: hoverMarker,
		};
	}

	/**
	* Returns a helper marker by name
	*
	* @public
	* @param name
	* @returns {*}
	*/
	getHelperMarker(name: string) {
		// @ts-ignore
		return this._helperMarkers[name] as Marker;
	}

	/**
	 * Moves a given control to a given position.
	 *
	 * @param control
	 * @param position
	 */
	moveControl(control: IControl, position: ControlPosition) {
		this.removeControl(control);
		this.addControl(control, position);
	}
}

export default Map;
