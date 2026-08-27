import type { Geometry, Position } from "geojson";
import type { Feature as MapLibreFeature } from "./MapLibre.js";

type FeatureProperties = {
	[_: string]: any;
};

type F = MapLibreFeature & {
	geometry: G;
}

type G = Geometry & {
	coordinates?: Position | Position[] | Position[][];
}
/**
 * Class that represents a geojson feature
 *
 * @class
 * @public
 */
class Feature {
	map;
	source;
	feature: F;
	layer: any;

	constructor(map: any, source: any, feature: F) {
		this.map = map;
		this.source = source;
		this.feature = feature;
	}

	get type() {
		return "Feature";
	}

	/**
	* Returns the id of the geojson feature, if set
	*
	* @default 0
	* @public
	*/
	get id(): number {
		return this.feature.id as number;
	}

	/**
	* Returns the geometry of the geojson feature
	*
	* @default null
	* @public
	*/
	get geometry(): G {
		return this.feature.geometry;
	}

	/**
	* Returns the properties of the geojson feature
	*
	* @default null
	* @public
	*/
	get properties(): FeatureProperties {
		return this.feature.properties;
	}

	/**
	* Sets feature state
	* @public
	* @param state
	*/
	setState(state: any): void {
		this.map.setFeatureState({
			source: this.source.id,
			id: this.id,
		}, { "ui5-geomap-state": state });
	}
}

export type { FeatureProperties, F, G };

export default Feature;
