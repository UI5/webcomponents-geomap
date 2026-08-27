import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import GeomapFloat from "./converters/GeomapFloat.js";
import GeomapInteger from "./converters/GeomapInteger.js";
import GeomapString from "./converters/GeomapString.js";
import GeomapLayer from "./GeomapLayer.js";
import geomapProperty from "./decorators/geomapProperty.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-circle-layer` defines the Circle Layer webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapCircleLayer.js";`
 *
 * @constructor
 * @extends GeomapLayer
 * @experimental
 * @public
 */
@customElement("ui5-geomap-circle-layer")

class GeomapCircleLayer extends GeomapLayer {
	/**
	* Describes the radius of the circle.
	* @default ""
	* @public
	*/
	@geomapProperty({ converter: GeomapFloat, type: Number, paint: "circle-radius" })
	radius = "";
	/**
	* Describes the fill color of the circle.
	* @default "black"
	* @public
	*/
	@geomapProperty({ converter: GeomapString, paint: "circle-color" })
	fillColor = "black";
	/**
	* Describes the outline color of the circle.
	* @default "black"
	* @public
	*/
	@geomapProperty({ converter: GeomapString, paint: "circle-stroke-color" })
	outlineColor = "black";
	/**
	* Describes the width of the outline of the circle.
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
	@geomapProperty({ converter: GeomapFloat, type: Number, paint: "circle-opacity" })
	opacity = 0.5;

	/**
	* @override
	*/
	get layerType() {
		return "circle";
	}
}

GeomapCircleLayer.define();

export default GeomapCircleLayer;
