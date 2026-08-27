import type { F } from "./Feature.js";
import Feature from "./Feature.js";

/**
 * Class that represents a geojson feature for a cluster
 *
 * @class
 * @public
 */
class Cluster extends Feature {
	/**
	 * Returns all  original points in a cluster
	 * @public
	 * @param limit How many items to return (useful for paging)
	 * @param offset From what index to return items (useful for paging)
	 */
	async getLeaves(limit: number, offset: number): Promise<F> {
		const leaves: F = await this.source.getClusterLeaves(this.properties.cluster_id, limit, offset);
		return leaves;
	}

	/**
	 * Returns all children (other clusters) of a cluster
	 * @public
	 * @returns Promise
	 */
	async getChildren(): Promise<F> {
		const children: F = await this.source.getClusterChildren(this.properties.cluster_id);
		return children;
	}

	/**
	 * Expands the cluster by zooming the map just beyond the level where the cluster forms
	 * @public
	 * @returns Promise
	 */
	async expand(): Promise<number> {
		const zoom = await this.source.getClusterExpansionZoom(this.properties.cluster_id) as number;
		this.map.easeTo({
			center: this.geometry.coordinates,
			zoom,
		});
		return zoom;
	}

	/**
	 * Determines if a geojson feature is a cluster
	 *
	 * @public
	 * @param feature geojson feature
	 * @returns true|false
	 */
	static isCluster(feature: F): boolean {
		return !!feature.properties.cluster;
	}
}

export default Cluster;
