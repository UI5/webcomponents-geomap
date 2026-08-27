import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import geomapProperty from "./decorators/geomapProperty.js";
import GeomapInteger from "./converters/GeomapInteger.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-circle-layer-state` defines the Circle Layer State webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapCircleLayerState.js";`
 *
 * @constructor
 * @extends UI5Element
 * @experimental
 * @public
 */
@customElement("ui5-geomap-circle-layer-state")

class GeomapCircleLayerState extends UI5Element {
	/**
	* Describes the name of the cirle layer state.
	* @default ""
	* @public
	*/
	@property({ type: String })
	name = "";
	/**
	* Describes the radius of the circle.
	* @default 0
	* @public
	*/
	@geomapProperty({ type: Number, paint: "circle-radius" })
	radius = 0;
	/**
	* Describes the fill color of the circle.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "circle-color" })
	fillColor = "black";
	/**
	* Describes the outline color of the circle.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "circle-stroke-color" })
	outlineColor = "black";
	/**
	* Describes the outline width of the circle.
	* @default 0
	* @public
	*/
	@geomapProperty({ converter: GeomapInteger, type: Number, paint: "circle-stroke-width" })
	outlineWidth = 0;
	/**
	* Describes the opacity of the circle.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "circle-opacity" })
	opacity = 0.5;
}

GeomapCircleLayerState.define();

export default GeomapCircleLayerState;
