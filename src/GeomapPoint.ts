import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-point` defines the Point webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapPoint.js";`
 *
 * @constructor
 * @extends UI5Element
 * @experimental
 * @public
 */
@customElement("ui5-geomap-point")

class GeomapPoint extends UI5Element {
	/**
	* Longitute of the point.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	lng = 0;
	/**
	* Latitude of the point.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	lat = 0;
}

GeomapPoint.define();

export default GeomapPoint;
