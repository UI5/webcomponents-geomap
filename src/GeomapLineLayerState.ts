import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import geomapProperty from "./decorators/geomapProperty.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-line-layer-state` defines the Line Layer State webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapLineLayerState.js";`
 *
 * @constructor
 * @extends UI5Element
 * @experimental
 * @public
 */
@customElement("ui5-geomap-line-layer-state")

class GeomapLineLayerState extends UI5Element {
	/**
	* Describes the name of the layer.
	* @default ""
	* @public
	*/
	@property({ type: String })
	name = "";
	/**
	* Describes the color of the layer.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "line-color" })
	color = "black";
	/**
	* Describes the width of the layer.
	* @default 0
	* @public
	*/
	@geomapProperty({ type: Number, paint: "line-width" })
	width = 0;
	/**
	* Describes the opacity of the layer.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "line-opacity" })
	opacity = 0.5;
}

GeomapLineLayerState.define();

export default GeomapLineLayerState;
