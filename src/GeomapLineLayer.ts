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
 * The `ui5-geomap-line-layer` defines the Line Layer webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapLineLayer.js";`
 *
 * @constructor
 * @extends GeomapLayer
 * @experimental
 * @public
 */
@customElement("ui5-geomap-line-layer")
class GeomapLineLayer extends GeomapLayer {
	/**
	* Describes the color of the line layer.
	* @default "black"
	* @public
	*/
	@geomapProperty({ converter: GeomapString, paint: "line-color" })
	color = "black";
	/**
	* Describes the opacity of the line layer.
	* @default ""
	* @public
	*/
	@geomapProperty({ converter: GeomapFloat, type: Number, paint: "line-opacity" })
	opacity = "";

	/**
	* @override
	*/
	get layerType() {
		return "line";
	}
}

GeomapLineLayer.define();

export default GeomapLineLayer;
