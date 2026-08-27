import type { BBox } from "geojson";
import { LngLat, LngLatBounds } from "../MapLibre.js";
import { GeometryBasis } from "./GeomapGeometryTypes.js";
import type {
	PointCoordinatesType,
	GeomapFeatureType,
	GeomapPoint,
	IValidity, DestinationPointType,
	LineStringFeatureType,
	PolygonCoordinatesType,
} from "./GeomapGeometryTypes.js";
import type { F } from "../types/GeomapGeometryTypes.js";
import { getLongLatPrecision } from "../config/Config.js";

type PointDistType = PointCoordinatesType | GeomapFeatureType | GeomapPoint | F;

/**
 * Class that provides common methods used in Geomap Geometry.
 *
 * @class
 * @private
 */
class GeomapGeometryUtil {
	/**
	 * Calculates distance between points.
	 * @param from
	 * @param to
	 * @param options
	 * @returns distance between the given points
	 */
	static pointDistance(from: PointDistType, to: PointDistType, options: any) {
		const coordinates1 = this.getPointCoordinates(from),
			coordinates2 = this.getPointCoordinates(to),
			dLat = this.convertPointCoordinatesFromDegreesToRadians(coordinates2[1] - coordinates1[1]),
			dLon = this.convertPointCoordinatesFromDegreesToRadians(coordinates2[0] - coordinates1[0]),
			lat1 = this.convertPointCoordinatesFromDegreesToRadians(coordinates1[1]),
			lat2 = this.convertPointCoordinatesFromDegreesToRadians(coordinates2[1]),
			a = (Math.sin(dLat / 2) ** 2)
				+ (Math.sin(dLon / 2) ** 2) * Math.cos(lat1) * Math.cos(lat2);
		return this.convertRadiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), options.units as string);
	}

	/**
	 * Extracts coordinates from given geometry type.
	 * @param oCoordinates
	 */
	static getPointCoordinates(oCoordinates: PointDistType) {
		if (!oCoordinates) {
			throw new Error("Please make sure you provide correct argument for coordinates.");
		}
		if (!Array.isArray(oCoordinates)) {
			if (oCoordinates.type === "Feature"
				&& oCoordinates.geometry !== null
				&& oCoordinates.geometry.type === "Point") {
				return oCoordinates.geometry.coordinates;
			}
			if (oCoordinates.type === "Point") {
				return (oCoordinates as GeomapPoint).coordinates;
			}
		}
		if (Array.isArray(oCoordinates)
			&& oCoordinates.length >= 2
			&& !Array.isArray(oCoordinates[0])
			&& !Array.isArray(oCoordinates[1])) {
			return oCoordinates;
		}
		throw new Error("Coordinates argument must be of type GeoJSON Point or an Array of numbers");
	}

	/**
	 * Validates given set of coordinates.
	 *
	 * @param pointCoords
	 */
	static isValidCoordinates(pointCoords: PointCoordinatesType): IValidity {
		// check if no coords => throw an error
		let sMsg: string = "";
		let bValid: boolean = true;

		if (!pointCoords) {
			bValid = false;
			sMsg = "Missing point coordinates. Make sure you provide correct point coordinates";
			return {
				bValid,
				sMsg,
			} as unknown as IValidity;
		}
		if (!Array.isArray(pointCoords)) {
			bValid = false;
			sMsg = "Point coordinates must be of type array";
			return {
				bValid,
				sMsg,
			} as unknown as IValidity;
		}
		if (!pointCoords[0] || !pointCoords[1]) {
			bValid = false;
			sMsg = "Missing one of the point coordinates. Please make sure you provide correct point coordinates";
			return {
				bValid,
				sMsg,
			} as unknown as IValidity;
		}

		return {
			bValid,
			sMsg,
		} as unknown as IValidity;
	}

	/**
	 * Validator for arguments provided for creating a geomap line.
	 *
	 * @param aPointCoordinates
	 */
	static geomapLineValidate(aPointCoordinates: Array<PointCoordinatesType>): IValidity {
		let bValid: boolean = true,
			sMsg: string = "";
		if (aPointCoordinates.length < 2) {
			bValid = false;
			sMsg = "Given coordinates must be an array of at lease two positions.";
		}

		return {
			bValid,
			sMsg,
		} as unknown as IValidity;
	}

	/**
	 * Validator for arguments provided for creating a geomap polygon.
	 *
	 * @param aPointCoordinates
	 */
	static geomapPolygonValidate(aPointCoordinates: PolygonCoordinatesType): IValidity {
		let bValid: boolean = true,
			sMsg: string = "";
		if (!aPointCoordinates) {
			bValid = false;
			sMsg = "Missing coordinates for polygon. Please check input arguments.";
			return {
				bValid,
				sMsg,
			} as unknown as IValidity;
		}
		if (aPointCoordinates[0].length < 2) {
			bValid = false;
			sMsg = "Given coordinates for polygon are incorrect. Please check input arguments.";
		}

		return {
			bValid,
			sMsg,
		} as unknown as IValidity;
	}

	/**
	 * Converts radians to degrees.
	 * @param iRadians
	 */
	static convertPointCoordinatesFromtRadiansToDegrees(iRadians: number) {
		const iDegrees: number = iRadians % (2 * Math.PI);
		return (iDegrees * 180) / Math.PI;
	}

	/**
	 * Converts degrees to radians.
	 * @param iDegrees
	 */
	static convertPointCoordinatesFromDegreesToRadians(iDegrees: number) {
		const iRadians: number = iDegrees % 360;
		return (iRadians * Math.PI) / 180;
	}

	/**
	 * Transforms/converts radians to given unit
	 * @param iRadians
	 * @param sUnits
	 */
	static convertRadiansToLength(iRadians: number, sUnits: string) {
		if (sUnits === undefined) {
			sUnits = "kilometers";
		} // defaulting value
		let iBasis;
		try {
			iBasis = GeometryBasis[<any>sUnits] as unknown as number;
			if (iBasis === undefined) {
				throw new Error(`Provided unit metric is not a valid one`);
			}
		} catch (e) {
			throw new Error(`Provided unit metric is not a valid one`);
		}
		return iRadians * iBasis;
	}

	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @param iDistance in real units
	 * @param sUnits
	 * @returns radians
	 */
	static convertLengthToRadians(iDistance: number, sUnits: string) {
		if (sUnits === undefined) {
			sUnits = "kilometers";
		} // defaulting value
		let iBasis;
		try {
			iBasis = GeometryBasis[<any>sUnits] as unknown as number;
			if (iBasis === undefined) {
				throw new Error(`Provided unit metric is not a valid one`);
			}
		} catch (e) {
			throw new Error(`Provided unit metric is not a valid one`);
		}
		return iDistance / iBasis;
	}

	/**
	 * Extracts Geometry from Feature or Geometry Object
	 *
	 * @param oGeoJSON GeoJSON Feature or Geometry Object
	 * @returns GeoJSON Geometry Object
	 * const oPoint = {
	 *   "type": "Feature",
	 *   "properties": {},
	 *   "geometry": {
	 *     "type": "Point",
	 *     "coordinates": [110, 40]
	 *   }
	 * }
	 * const oGeometry = extractGeomapGeometry(oPoint)
	 * //={"type": "Point", "coordinates": [110, 40]}
	 */
	static extractGeomapGeometry(oGeoJSON: F | GeomapPoint | LineStringFeatureType): any {
		if (oGeoJSON.type === "Feature") {
			return oGeoJSON.geometry;
		}
		return oGeoJSON;
	}

	/**
	 * Takes a geomap Point and calculates the location of a destination point given a distance in
	 * degrees, radians, miles, or kilometers; and bearing in degrees by using Haversine formula.
	 *
	 * @param pointOrigin starting point
	 * @param iDistance distance from the origin point
	 * @param iBearing ranging from -180 to 180
	 * @param oOpts Optional parameters
	 * @returns destination point
	 * const oPoint = geomapPoint([-75.343, 39.984]);
	 * const iDistance = 50;
	 * const iBearing = 90;
	 * const oOptions = {units: 'miles'};
	 *
	 * const destination = calculateDestination(oPoint, iDistance, iBearing, oOptions);
	 */
	static calculateDestination(pointOrigin: PointCoordinatesType | F | undefined, iDistance: number, iBearing: number, oOpts: any) {
		if (oOpts === undefined) {
			oOpts = {};
		} // defaulting...

		if (pointOrigin === undefined) {
			return {
				lng: 0,
				lat: 0,
				opts: {},
			} as DestinationPointType;
		}

		// convert input arguments
		const coordinates1 = this.getPointCoordinates(pointOrigin),
			longitude1 = this.convertPointCoordinatesFromDegreesToRadians(coordinates1[0]),
			latitude1 = this.convertPointCoordinatesFromDegreesToRadians(coordinates1[1]),
			bearingRad = this.convertPointCoordinatesFromDegreesToRadians(iBearing),
			radians = this.convertLengthToRadians(iDistance, oOpts.units as string);

		// transformations
		const latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians)
			+ Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad));
		const longitude2 = longitude1
			+ Math.atan2(Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1), Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));
		const lng = this.convertPointCoordinatesFromtRadiansToDegrees(longitude2);
		const lat = this.convertPointCoordinatesFromtRadiansToDegrees(latitude2);

		const precision = getLongLatPrecision() as unknown as number;

		const tLng = lng.toPrecision(precision);
		const tLat = lat.toPrecision(precision);

		return {
			lng: parseFloat(tLng) as unknown as number,
			lat: parseFloat(tLat) as unknown as number,
			opts: oOpts.properties,
		} as DestinationPointType;
	}

	/**
	 *
	 * @param pt point [x,y]
	 * @param bbox BBox [west, south, east, north]
	 * @returns true/false if point is inside BBox
	 */
	static inBBox(pt: number[], bbox: BBox) {
		return (
			bbox[0] <= pt[0] && bbox[1] <= pt[1] && bbox[2] >= pt[0] && bbox[3] >= pt[1]
		);
	}

	/**
	 * Based on point-in-polygon-hao
	 * The MIT License (MIT) - Copyright (c) 2021 Rowan Winsemius
	 *
	 * Takes point and polygon as arguments and determines if the point is located in the polygon.
	 * This library is based on the paper Optimal Reliable Point-in-Polygon Test and Differential Coding Boolean Operations on Polygons.
	 * @param point
	 * @param polygon
	 * @returns true if inside, false if outside and 0 if point is on edge
	 *
	 * const point = [13.283843994140625, 42.16849286599469];
	 * const polygon = [
	 *   [
	 *     [12.367115771, 42.778762088],
	 *     [14.681863801, 42.63796868],
	 *     [13.214789935, 40.934229176],
	 *     [12.367115771, 42.778762088]
	 *   ]
	 * ];
	 * geomapPointInPolygon(point, polygon); => true
	 */
	static geomapPointInPolygon(point: PointCoordinatesType, polygon: PolygonCoordinatesType) {
		let i = 0,
			j = 0,
			k = 0,
			f = 0,
			u1 = 0,
			v1 = 0,
			u2 = 0,
			v2 = 0,
			currentPoint = null,
			nextPoint = null;

		const x = point[0],
			y = point[1],
			contursNumber = polygon.length;

		for (i; i < contursNumber; i++) {
			j = 0;
			const polygonLen = polygon[i].length - 1,
				contour = polygon[i];

			currentPoint = contour[0];
			// check if polygon is correct by checking its edges (first must be equal to last)
			if (currentPoint[0] !== contour[polygonLen][0]
				&& currentPoint[1] !== contour[polygonLen][1]) {
				throw new Error("First and last coordinates in the polygon must be the same. Please make sure you provide correct polygon.");
			}

			u1 = currentPoint[0] - x;
			v1 = currentPoint[1] - y;

			for (j; j < polygonLen; j++) {
				nextPoint = contour[j + 1];

				v2 = nextPoint[1] - y;

				if ((v1 < 0 && v2 < 0) || (v1 > 0 && v2 > 0)) {
					currentPoint = nextPoint;
					v1 = v2;
					u1 = currentPoint[0] - x;
					// eslint-disable-next-line no-continue
					continue;
				}

				u2 = nextPoint[0] - point[0];

				f = (u1 * v2) - (u2 * v1);
				if ((v2 > 0 && v1 <= 0) || (v1 > 0 && v2 <= 0) || (v2 === 0 && v1 < 0) || (v1 === 0 && v2 < 0)) {
					if (f === 0) {
						return 0;
					}

					if ((v2 > 0 && v1 <= 0 && f > 0) || (v1 > 0 && v2 <= 0 && f < 0)) {
						k += 1;
					}
				} else if (v1 === 0 && v2 === 0 && ((u2 <= 0 && u1 >= 0) || (u1 <= 0 && u2 >= 0))) {
					return 0;
				}

				currentPoint = nextPoint;
				v1 = v2;
				u1 = u2;
			}
		}

		if (k % 2 === 0) { return false; }
		return true;
	}

	/**
	 * Takes a determines if a given point resides inside the polygon.
	 *
	 * @param point input point
	 * @param polygon input geomap Polygon or MultiPolygon
	 * @param oOpts Optional parameters {opts.ignoreBoundary True if polygon boundary should be ignored when determining if the point is inside the polygon otherwise false. Default is false.}
	 * @returns true if the Point is inside the Polygon; false if the Point is not inside the Polygon
	 *
	 * var pt = geomapPoint([-77, 44]);
	 * var polygon = geomapPolygon([[
	 *   [-81, 41],
	 *   [-81, 47],
	 *   [-72, 47],
	 *   [-72, 41],
	 *   [-81, 41]
	 * ]]);
	 *
	 * isPointInPolygon(point, polygon);
	 */
	static isPointInPolygon(
		point: F,
		polygon: F,
		oOpts?: any,
	) {
		if (!point || !polygon) {
			throw new Error("Please make sure you provide correct arguments.");
		}

		if (oOpts === undefined) {
			oOpts = {
				ignoreBoundary: false,
			};
		} // defaulting...

		const poi = this.getPointCoordinates(point),
			geom = this.extractGeomapGeometry(polygon),
			type = geom.type,
			bbox = polygon.bbox;
		let polys: any[] = geom.coordinates,
			result = false,
			i;

		// firstly check if point is not inside bbox
		if (bbox && this.inBBox(poi, bbox) === false) {
			return result;
		}

		if (type === "Polygon") {
			polys = [polys];
		}
		for (i = 0; i < polys.length; ++i) {
			const polyResult = this.geomapPointInPolygon(poi, polys[i] as PolygonCoordinatesType);
			if (polyResult === 0) { return !oOpts.ignoreBoundary; }
			if (polyResult) { result = true; }
		}

		return result;
	}

	/**
	 * Takes a determines if a given point resides inside the polygon by using LngLatBounds.
	 * Creates LngLat from the argument point and LngLatBounds from the argument polygon's edges.
	 *
	 * @param point input point
	 * @param polygon input geomap Polygon or MultiPolygon
	 * @returns true if the Point is inside the Polygon; false if the Point is not inside the Polygon
	 *
	 * var pt = geomapPoint([-77, 44]);
	 * var polygon = geomapPolygon([[
	 *   [-81, 41],
	 *   [-81, 47],
	 *   [-72, 47],
	 *   [-72, 41],
	 *   [-81, 41]
	 * ]]);
	 *
	 * pointInPolygonBounds(point, polygon);
	 */
	static pointInPolygonBounds(point: F, polygon: F) {
		if (!point || !polygon) {
			throw new Error("Please make sure you provide correct arguments.");
		}

		const poi = this.getPointCoordinates(point);
		const geometry = this.extractGeomapGeometry(polygon);
		const polys: any[] = geometry.coordinates;

		const bounds = new LngLatBounds();

		polys.forEach(poly => {
			if (Array.isArray(poly)) {
				poly.forEach(p => {
					bounds.extend(new LngLat(p[0] as number, p[1] as number));
				});
			} else {
				bounds.extend(new LngLat(poly[0][0] as number, poly[0][1] as number));
			}
		});

		const ll = new LngLat(poi[0], poi[1]);
		const llb = new LngLatBounds(bounds.getSouthWest(), bounds.getNorthEast());

		return llb.contains(ll);
	}
}

export default GeomapGeometryUtil;
