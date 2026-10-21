import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import type {
	Units,
} from "./types/GeomapGeometryTypes.js";
import GeomapShape from "./GeomapShape.js";
import geomapProperty from "./decorators/geomapProperty.js";
import GeomapGeometry from "./geometry/GeomapGeometry.js";
import type { LineStringFeatureType, MultiplePointsCoordinatesType } from "./geometry/GeomapGeometryTypes.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-arc` defines the Arc webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapArc.js";`
 *
 * @constructor
 * @extends GeomapShape
 * @public
 */
@customElement("ui5-geomap-arc")

class GeomapArc extends GeomapShape {
	/**
	* Describes the longitude of the center of the starting point.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	beginLng = 0;
	/**
	* Describes the latitude of the center of the starting point.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	beginLat = 0;
	/**
	* Describes the longitude of the center of the ending point.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	endLng = 0;
	/**
	* Describes the latitude of the center of the ending point.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	endLat = 0;
	/**
	* Describes the number of steps to use in the arc and animation, more steps means
	* a smoother arc and animation, but too many steps will result in a low frame rate.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	steps = 0;
	/**
	* Describes the color of the line.
	* @default "blue"
	* @public
	*/
	@geomapProperty({ type: String, paint: "line-color" })
	color!: string;
	/**
	* Describes the width of the line.
	* @default 0
	* @public
	*/
	@geomapProperty({ type: Number, paint: "line-width" })
	width = 0;
	/**
	* Describes the opacity of the line.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "line-opacity" })
	opacity = 0.5;
	/**
	* @override
	*/
	sourceUpdateNeeded(changeInfo: InvalidationInfo) {
		if (changeInfo.type === "property") {
			const propName: string = changeInfo.name;
			return ["beginLng", "beginLat", "endLng", "endLat", "steps"].includes(propName);
		}

		return false;
	}

	get line() {
		const beginPoint = [this.beginLng, this.beginLat];
		const endPoint = [this.endLng, this.endLat];
		return GeomapGeometry.geomapLine([beginPoint, endPoint]);
	}

	/**
	* @override
	*/
	get sourceData() {
		const line = this.line;
		const distance = GeomapGeometry.geomapCalculateDistance(line, { units: "kilometers" });

		const points = [];
		for (let i = 0; i < distance; i += distance / this.steps) {
			// const point = along(line.geometry as unknown as LineString, i, { units: "kilometers" });
			const point = GeomapGeometry.geomapAlong(line.geometry as unknown as LineStringFeatureType, i, { units: "kilometers" });
			points.push(point.geometry.coordinates);
		}
		points.push([this.endLng, this.endLat]);

		return GeomapGeometry.geomapLine(points as MultiplePointsCoordinatesType);
	}

	/**
	* @override
	*/
	get layerType() {
		return "line";
	}

	/**
	* @override
	*/
	get layoutProperties() {
		return {
			...super.layoutProperties,
			"line-join": "round",
		};
	}

	/**
	* @public
	*/
	getPointAt(distance: number, units: { units?: Units } | undefined): any {
		// const point = along(this.line.geometry as unknown as LineString, distance, units);
		const point = GeomapGeometry.geomapAlong(this.line.geometry as unknown as LineStringFeatureType, distance, units);

		return {
			lng: point.geometry.coordinates[0] as number,
			lat: point.geometry.coordinates[1] as number,
		};
	}

	/**
	* @public
	*/
	getDistance(units: any): number {
		return GeomapGeometry.geomapCalculateDistance(this.line, { units });
	}
}

GeomapArc.define();

export default GeomapArc;
