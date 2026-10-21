import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import GeomapElement from "./GeomapElement.js";
import type { GeoJSONSource } from "./MapLibre.js";
import type { GeoJSON } from "geojson";

const EMPTY_GEOJSON = {
	type: "FeatureCollection",
	features: [],
};

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-source` defines the Source webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapSource.js";`
 *
 * @constructor
 * @extends GeomapElement
 * @public
 */
@customElement("ui5-geomap-source")

class GeomapSource extends GeomapElement {
	/**
	* GeoJSON as a source data.
	* @default {}
	* @public
	*/
	@property({ type: Object })
	geojson = {};

	/**
	* geojsonUrl - URL to GeoJSON file used as data
	* @default ""
	* @public
	*/
	@property({ type: String })
	geojsonUrl = "";

	constructor() {
		super();
		this.attachInvalidate(this.handleInvalidation.bind(this));
	}

	get effectiveId(): string {
		return this.id || this._id;
	}

	get effectiveData(): string | GeoJSON {
		return this.geojsonUrl || this.effectiveGeojson as unknown as GeoJSON;
	}

	get effectiveGeojson() {
		if (typeof this.geojson === "object" && this.geojson !== null && Object.keys(this.geojson).length > 0) {
			return this.geojson;
		}

		return EMPTY_GEOJSON;
	}

	async onEnterDOM() {
		await this.whenMapConnected();
		this.map?.addSource(this.effectiveId, {
			type: "geojson",
			data: this.effectiveData,
			...this.createOptions,
		});
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		if (!this.map || !this.map.getSource(this.effectiveId)) {
			return;
		}

		if (changeInfo.type === "property") {
			const propName: string = changeInfo.name;
			const mapSource: GeoJSONSource = this.map.getSource(this.effectiveId)!;
			if (["geojson", "geojsonUrl"].includes(propName)) {
				mapSource.setData(this.effectiveData);
			}
		}
	}

	get createOptions() {
		return {};
	}

	onExitDOM() {
		if (this.map) {
			this.map.removeSource(this.effectiveId);
		}
		super.onExitDOM();
	}

	/**
	* Sets feature state
	* @public
	* @param id
	* @param state
	*/
	setState(id: any, state: any): void {
		this.map?.setFeatureState({
			source: this.effectiveId,
			id,
		}, { "ui5-geomap-state": state });
	}

	get isGeomapSource() {
		return true;
	}

	/**
	* Returns the source object in maplibre
	*/
	get source() {
		return this.map?.getSource(this.effectiveId);
	}
}

GeomapSource.define();

export default GeomapSource;
