import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import GeomapInteger from "./converters/GeomapInteger.js";
import GeomapString from "./converters/GeomapString.js";
import GeomapLayer from "./GeomapLayer.js";
import geomapProperty from "./decorators/geomapProperty.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-symbol-layer` defines the Symbol Layer webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapSymbolLayer.js";`
 *
 * @constructor
 * @extends GeomapLayer
 * @public
 */
@customElement("ui5-geomap-symbol-layer")

class GeomapSymbolLayer extends GeomapLayer {
	/**
	* Text to be displayed in the layer.
	* @default ""
	* @public
	*/
	@geomapProperty({ converter: GeomapString, layout: "text-field" })
	text = "";
	/**
	* Size of the font that is displayed in the layer. Units in pixels. Requires text-field.
	* @default 0
	* @public
	*/
	@geomapProperty({ converter: GeomapInteger, type: Number, layout: "text-size" })
	textSize = 0;
	/**
	* Color of the text that is displayed in the layer.
	* @default "black"
	* @public
	*/
	@geomapProperty({ converter: GeomapString, paint: "text-color" })
	textColor = "black";
	/**
	* Which part of the text is closest to the point: "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"
	* @default "center"
	* @public
	*/
	@geomapProperty({ converter: GeomapString, layout: "text-anchor" })
	textAnchor = "center";
	/**
	* Font stack to use for displaying text. Defaults to Open Sans Regular,Arial Unicode MS Regular. Requires text-field.
	* @default ["Arial Unicode MS Regular"]
	* @public
	*/
	@geomapProperty({ converter: GeomapString, layout: "text-font" })
	textFont = ["Arial Unicode MS Regular"];

	/**
	 * Returns the layer type.
	* @override
	*/
	get layerType() {
		return "symbol";
	}
}

GeomapSymbolLayer.define();

export default GeomapSymbolLayer;
