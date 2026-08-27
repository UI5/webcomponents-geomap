import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import type { PromiseResolve } from "@ui5/webcomponents-base/dist/types.js";
import Map from "./extensions/Map.js";
import { TerraDraw } from "terra-draw";

/**
 * @class
 *
 * Base class for all map elements
 *
 * @constructor
 * @extends UI5Element
 * @experimental
 * @public
 */
class GeomapElement extends UI5Element {
	map: Map & {_ui5GeomapPromise?: Promise<void>} | undefined;
	draw: TerraDraw & {_ui5GeomapPromise?: Promise<void>} | undefined;
	_whenMapConnectedPromise: Promise<void> & { _deferredResolve?: PromiseResolve };

	constructor() {
		super();
		this.disconnectFromMap();
		let deferredResolve;
		this._whenMapConnectedPromise = new Promise(resolve => {
			deferredResolve = resolve;
		});
		this._whenMapConnectedPromise._deferredResolve = deferredResolve;
	}

	async whenMapConnected(): Promise<void> {
		return this._whenMapConnectedPromise;
	}

	async whenMapLoaded(): Promise<void> {
		return this.map!._ui5GeomapPromise;
	}

	async whenDrawConnected(): Promise<void> {
		return this.draw && this.draw._ui5GeomapPromise;
	}

	connectToMap(map: Map) {
		if (this.map instanceof Map) {
			return;
		}

		this.map = map;
		this._whenMapConnectedPromise._deferredResolve!();
	}

	connectToDraw(draw: TerraDraw) {
		if (this.draw instanceof TerraDraw) {
			return;
		}
		this.draw = draw;
	}

	disconnectFromMap() {
		this.map = undefined;
		let deferredResolve;
		this._whenMapConnectedPromise = new Promise(resolve => {
			deferredResolve = resolve;
		});
		this._whenMapConnectedPromise._deferredResolve = deferredResolve;
	}

	onExitDOM() {
		this.disconnectFromMap();
	}
}

export default GeomapElement;
