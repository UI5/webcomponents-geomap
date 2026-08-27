import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import type { Unit } from "./MapLibre.js";
import { ScaleControl } from "./MapLibre.js";
import GeomapControlBase from "./GeomapControlBase.js";
import type GeomapScaleControlUnits from "./types/GeomapScaleControlUnits.js";
/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-scale-control` defines the Scale webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapScaleControl.js";`
 *
 * @constructor
 * @extends GeomapControlBase
 * @experimental
 * @public
 */
@customElement("ui5-geomap-scale-control")

class GeomapScaleControl extends GeomapControlBase<ScaleControl> {
	/**
	* Units of the distance for the scale control. Possible values are "Imperial", "Metric" or "Nautical".
	* @default "Metric"
	* @public
	*/
	@property()
	units: `${GeomapScaleControlUnits}` = "Metric";

	async onEnterDOM() {
		this._instance = new ScaleControl({
			maxWidth: 100,
			unit: (this.effectiveUnits),
		});

		await super.onEnterDOM();
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		super.handleInvalidation(changeInfo);

		if (!this._instance || !this.map) {
			return;
		}

		if (changeInfo.type === "property" && changeInfo.name === "units") {
			this._instance.setUnit(this.effectiveUnits);
		}
	}

	get effectiveUnits() {
		return this.units.toLowerCase() as Unit;
	}
}

GeomapScaleControl.define();

export default GeomapScaleControl;
