import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import geomapProperty from "./decorators/geomapProperty.js";

/**
 * @class
 *
* ### Overview
 *
 * The `ui5-geomap-fill-layer-state` defines the Fill Layer State webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapFillLayerState.js";`
 *
 * @constructor
 * @extends UI5Element
 * @experimental
 * @public
 */
@customElement("ui5-geomap-fill-layer-state")

class GeomapFillLayerState extends UI5Element {
	/**
	* Describes the name of the layer.
	* @default ""
	* @public
	*/
	@property({ type: String })
	name = "";
	/**
	* Describes the fill color of the layer.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "fill-color" })
	fillColor = "black";
	/**
	* Describes the outline color of the layer.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "fill-outline-color" })
	outlineColor = "black";
	/**
	* Describes the opacity of the layer.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "fill-opacity" })
	opacity = 0.5;
}

GeomapFillLayerState.define();

export default GeomapFillLayerState;
