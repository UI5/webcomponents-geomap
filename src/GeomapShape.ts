import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import type { GeoJSONSource } from "./MapLibre.js";
import GeomapLayerBase from "./GeomapLayerBase.js";
import { customElement } from "@ui5/webcomponents-base/dist/decorators.js";

/**
 * GeomapShape
 *
 * @constructor
 * @extends GeomapLayerBase
 * @public
 */
@customElement("ui5-geomap-shape")
class GeomapShape extends GeomapLayerBase {
	/**
	* @override
	*/
	get layerSource() {
		const mapSource = this.map?.getSource(this._id);
		if (!mapSource) {
			this.map?.addSource(this._id, {
				type: "geojson",
				data: this.sourceData,
			});
		}

		return this._id;
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		if (!this.map || !this.map.getLayer(this._id)) {
			return;
		}

		if (this.sourceUpdateNeeded(changeInfo)) {
			this.updateSource();
			return;
		}

		super.handleInvalidation(changeInfo);
	}

	/**
	* @override
	*/
	removeLayer() {
		super.removeLayer();
		if (this.map?.getSource(this._id)) {
			this.map.removeSource(this._id);
		}
	}

	/**
	* Override to optimize which properties exactly affect the source
	*/
	sourceUpdateNeeded(changeInfo: InvalidationInfo): boolean {
		return !!changeInfo;
	}

	updateSource() {
		const mapSource: GeoJSONSource = this.map?.getSource(this._id) as GeoJSONSource;
		if (mapSource) {
			mapSource.setData(this.sourceData as string);
		}
	}
}

export default GeomapShape;
