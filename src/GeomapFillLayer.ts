import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import GeomapFloat from "./converters/GeomapFloat.js";
import GeomapString from "./converters/GeomapString.js";
import GeomapLayer from "./GeomapLayer.js";
import geomapProperty from "./decorators/geomapProperty.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-fill-layer` defines the Fill Layer webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapFillLayer.js";`
 *
 * @constructor
 * @extends GeomapLayer
 * @public
 */
@customElement("ui5-geomap-fill-layer")

class GeomapFillLayer extends GeomapLayer {
	/**
	* Describes the fill color of the layer.
	* @default "black"
	* @public
	*/
	@geomapProperty({ converter: GeomapString, paint: "fill-color" })
	fillColor = "black";
	/**
	* Describe the outline color of the layer.
	* @default "black"
	* @public
	*/
	@geomapProperty({ converter: GeomapString, paint: "fill-outline-color" })
	outlineColor = "black";
	/**
	* Describe the outline width of the layer.
	* @default ""
	* @public
	*/
	@geomapProperty({ converter: GeomapFloat, type: Number, paint: "fill-opacity" })
	opacity = "";

	/**
	* @override
	*/
	get layerType() {
		return "fill";
	}
}

GeomapFillLayer.define();

export default GeomapFillLayer;
