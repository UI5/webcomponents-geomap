import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import GeomapSource from "./GeomapSource.js";
import Cluster from "./Cluster.js";
import type { F } from "./Feature.js";

interface Options{
	cluster: boolean,
	clusterRadius: number,
	clusterMinPoints: number,
	clusterProperties: object,
	clusterMaxZoom?: number
}

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-cluster-source` defines the Cluster Source webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapClusterSource.js";`
 *
 * @constructor
 * @extends GeomapSource
 * @experimental
 * @public
 */
@customElement("ui5-geomap-cluster-source")

class GeomapClusterSource extends GeomapSource {
	/**
	* Cluster properties
	* @default {}
	* @public
	*/
	@property({ type: Object })
	clusterProperties = {};

	/**
	* Cluster radius - the bigger, the sooner points will be clustered
	* @default 50
	* @public
	*/
	@property({ type: Number })
	clusterRadius = 50;

	/**
	* Cluster min points - minimum amount of points, required to form a cluster
	* @default 2
	* @public
	*/
	@property({ type: Number })
	clusterMinPoints = 2;

	/**
	* Cluster max zoom - when the zoom level is above this value, clustering is disabled
	* @default 0
	* @public
	*/
	@property({ type: Number })
	clusterMaxZoom = 0;

	constructor() {
		super();
	}

	get createOptions() {
		const options: Options = {
			cluster: true,
			clusterRadius: this.clusterRadius,
			clusterMinPoints: this.clusterMinPoints,
			clusterProperties: this.clusterProperties,
		};
		if (this.clusterMaxZoom) {
			options.clusterMaxZoom = this.clusterMaxZoom;
		}

		return options;
	}

	/**
	* Returns all clusters, currently visible on the screen.
	* @public
	*/
	getClusters(): any {
		if (!this.map) {
			return [];
		}
		const features: Array<F> = this.map.querySourceFeatures(this.effectiveId) as unknown as Array<F>;
		return features.filter(feature => { return Cluster.isCluster(feature); }).map((feature: F) => new Cluster(this.map, this.source, feature));
	}
}

GeomapClusterSource.define();

export default GeomapClusterSource;
