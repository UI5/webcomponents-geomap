import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import GeomapElement from "./GeomapElement.js";
import camelToKebabCase from "./utils/camelToKebabCase.js";
import type { IControl } from "./MapLibre.js";
import type GeomapMapControlPosition from "./types/GeomapMapControlPosition.js";

/**
 * Base class for all controls
 *
 * @constructor
 * @extends GeomapElement
 * @experimental
 * @public
 */
class GeomapControlBase<T extends IControl> extends GeomapElement {
	/**
	* Position of the control on the map. Can be one of the following: "TopLeft", "TopRight", "BottomLeft", "BottomRight".
	* @public
	*/
	@property()
	position: `${GeomapMapControlPosition}` = "TopLeft";

	_instance?: T;

	constructor() {
		super();

		this.attachInvalidate(this.handleInvalidation.bind(this));
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		if (!this._instance || !this.map) {
			return;
		}

		if (changeInfo.type === "property" && changeInfo.name === "position") {
			this.map.moveControl(this._instance, this.effectivePosition);
		}
	}

	get isGeoMapControl() {
		return true;
	}

	get effectivePosition() {
		return camelToKebabCase(this.position);
	}

	async onEnterDOM() {
		await this.whenMapConnected();
		this.map?.addControl(this._instance!, this.effectivePosition);
	}

	onExitDOM() {
		if (this.map) {
			this.map.removeControl(this._instance!);
		}
		this._instance = undefined;
		super.onExitDOM();
	}
}

export default GeomapControlBase;
