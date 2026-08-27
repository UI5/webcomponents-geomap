import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import geomapProperty from "./decorators/geomapProperty.js";
import GeomapLayerBase from "./GeomapLayerBase.js";
import { TerraDraw } from "terra-draw";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-raster-tiles` defines the Raster tiles webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapRasterTiles.js";`
 *
 * @constructor
 * @extends GeomapLayerBase
 * @experimental
 * @public
 */
@customElement("ui5-geomap-raster-tiles")

class GeomapRasterTiles extends GeomapLayerBase {
	/**
	* URL string of the raster tiles source.
	* @default ""
	* @public
	*/
	@property({ type: String })
	url = "";

	/**
	* Opacitiy of the layer.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "raster-opacity" })
	opacity = 0.5;

	/**
	* @override
	*/
	get layerSource() {
		const mapSource = this.map?.getSource(this._id);
		if (!mapSource) {
			this.map?.addSource(this._id, {
				type: "raster",
				url: this.url,
				tileSize: 256,
			});
		}

		return this._id;
	}

	async onAfterRendering() {
		await this.whenMapConnected();
		const mapLayer = this.map?.getLayer(this._id);
		if (!mapLayer) {
			return;
		}
		this.updateSource();
	}

	updateSource() {

	}

	connectToDraw(draw: TerraDraw) {
		if (this.draw instanceof TerraDraw) {
			return;
		}
		this.draw = draw;
	}

	/**
	* @override
	*/
	get layerType() {
		return "raster";
	}
}

GeomapRasterTiles.define();

export default GeomapRasterTiles;
