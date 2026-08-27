import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import slot from "@ui5/webcomponents-base/dist/decorators/slot.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import type { Coordinates, ImageSource } from "./MapLibre.js";
import geomapProperty from "./decorators/geomapProperty.js";
import GeomapLayerBase from "./GeomapLayerBase.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-image` defines the Image webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapImage.js";`
 *
 * @constructor
 * @extends GeomapLayerBase
 * @experimental
 * @public
 */
@customElement("ui5-geomap-image")

class GeomapImage extends GeomapLayerBase {
	/**
	* Url of the image to be displayed in the layer.
	* @default ""
	* @public
	*/
	@property({ type: String })
	url = "";
	/**
	* Describes the opacity of the image layer.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "raster-opacity" })
	opacity = 0.5;
	/**
	* Points describing the coordinates of the image.
	*
	* @public
	*/
	@slot({ type: HTMLElement, invalidateOnChildChange: true, "default": true })
	points!: Array<HTMLElement>;

	/**
	* @override
	*/
	get layerSource() {
		const mapSource = this.map?.getSource(this._id);
		if (!mapSource) {
			this.map?.addSource(this._id, {
				type: "image",
				"coordinates": this.coordinates as Coordinates,
				"url": this.url,
			});
		}

		return this._id;
	}

	async onAfterRendering() {
		await this.whenMapConnected();
		this.updateSource();
	}

	updateSource() {
		const mapSource = this.map?.getSource(this._id) as ImageSource;
		if (mapSource) {
			mapSource.setCoordinates(this.coordinates as Coordinates);
			mapSource.updateImage({
				url: this.url,
			});
		}
	}

	/**
	* @override
	*/
	get layerType() {
		return "raster";
	}

	get coordinates() {
		return this.points.map((point: any) => [point.lng as number, point.lat as number]);
	}

	/**
	* @override
	*/
	get paintProperties() {
		return {
			"raster-opacity": this.opacity,
			"raster-fade-duration": 0, // avoid blinking when changing images
		};
	}
}

GeomapImage.define();

export default GeomapImage;
