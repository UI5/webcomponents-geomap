import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import GeomapLayer from "./GeomapLayer.js";
import GeomapFloat from "./converters/GeomapFloat.js";
import GeomapInteger from "./converters/GeomapInteger.js";
import GeomapString from "./converters/GeomapString.js";
import geomapProperty from "./decorators/geomapProperty.js";

/**
 * @class
 *
  * ### Overview
 *
 * The `ui5-geomap-heatmap-layer` defines the Heatmap Layer webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapHeatmapLayer.js";`
 *
 * @constructor
 * @extends GeomapLayer
 * @experimental
 * @public
 */
@customElement("ui5-geomap-heatmap-layer")

class GeomapHeatmapLayer extends GeomapLayer {
	/**
	* Describes the color of the heatmap layer.
	* @default "black"
	* @public
	*/
	@geomapProperty({ converter: GeomapString, paint: "heatmap-color" })
	color = "black";
	/**
	* Describes the intensity of the heatmap layer.
	* @default ""
	* @public
	*/
	@geomapProperty({ converter: GeomapString, paint: "heatmap-intensity" })
	intensity = "";
	/**
	* Describes the weight of the heatmap layer.
	* @default 0
	* @public
	*/
	@geomapProperty({ converter: GeomapInteger, type: Number, paint: "heatmap-weight" })
	weight = 0;
	/**
	* Describes the radius of the heatmap.
	* @default 0
	* @public
	*/
	@geomapProperty({ converter: GeomapInteger, type: Number, paint: "heatmap-radius" })
	radius = 0;
	/**
	* Describes the radius of the heatmap.
	* @default ""
	* @public
	*/
	@geomapProperty({ converter: GeomapFloat, type: Number, paint: "heatmap-opacity" })
	opacity = "";

	/**
	* @override
	*/
	get layerType() {
		return "heatmap";
	}
}

GeomapHeatmapLayer.define();

export default GeomapHeatmapLayer;
