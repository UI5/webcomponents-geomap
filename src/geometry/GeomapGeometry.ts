import type {
	BBox, GeoJSON, Position,
} from "geojson";
import type { GeoJSONStoreFeatures } from "terra-draw";
import { ValidateNotSelfIntersecting } from "terra-draw";
import type { Point2D } from "../MapLibre.js";
import type {
	IValidity,
	PointCoordinatesType,
	MultiplePointsCoordinatesType,
	FeatureSetType, PolygonCoordinatesType, LineStringFeatureType,
} from "./GeomapGeometryTypes.js";
import GeomapGeometryUtil from "./GeomapGeometryUtil.js";
import type { F, G, GeomapGeoJSON } from "../types/GeomapGeometryTypes.js";

/**
 * Class responsible for the geometry of the objects used in GeoMap Web Component.
 *
 * @class
 * @private
 */
export default class GeomapGeometry {
	/**
	 * Creates geomap Point Feature based on input arguments - coordinates.
	 *
	 * @param pointCoords
	 * @param pointProps
	 * @param pointOptions
	 * @returns Geomap Point Feature
	 */
	static geomapPoint(pointCoords: PointCoordinatesType, pointProps?: any, pointOptions?: any): F {
		const oValidity: IValidity = GeomapGeometryUtil.isValidCoordinates(pointCoords);
		if (!oValidity.bValid) {
			throw new Error(oValidity.sMsg);
		}

		const geomapObj = {
			type: "Point",
			coordinates: pointCoords,
		};
		return this.geomapCreateFeature(geomapObj, pointProps, pointOptions);
	}

	/**
	 * Creates a set of Feature Points based on given argument - set of coordinates.
	 *
	 * @param aGeomapPoints
	 * @param pointProps
	 * @param pointOptions
	 */
	static geomapPoints(aGeomapPoints: Array<PointCoordinatesType>, pointProps?: any, pointOptions?: any) {
		return this.geomapFeatureSet(aGeomapPoints.map((pointCoords: PointCoordinatesType) => {
			return this.geomapPoint(pointCoords, pointProps);
		}), pointOptions);
	}

	/**
	 * Creates Feature object based on given input arguments.
	 *
	 * @param geomapObj
	 * @param pointProps
	 * @param pointOptions
	 * @returns Representable GeoJSON Feature
	 */
	static geomapCreateFeature(geomapObj: any, pointProps?: any, pointOptions?: any): F {
		if (pointOptions === undefined) {
			pointOptions = {};
		}
		const oGeomapFeature: F = {
			type: "Feature",
			id: undefined,
			properties: {},
			bbox: undefined,
			geometry: {} as (Point2D[][] & G),
		};
		if (pointOptions.id === 0 || pointOptions.id) {
			oGeomapFeature.id = pointOptions.id;
		}
		if (pointOptions.bbox) {
			oGeomapFeature.bbox = pointOptions.bbox;
		}
		oGeomapFeature.properties = pointProps || {};
		oGeomapFeature.geometry = geomapObj;
		return oGeomapFeature;
	}

	/**
	 * Creates a Feature collection based on given argument - array of geomap features.
	 *
	 * @param geomapFeatures
	 * @param pointOptions
	 */
	static geomapFeatureSet(geomapFeatures: Array<F>, pointOptions?: any) {
		const featureSet: FeatureSetType = {
			type: "FeatureCollection",
			id: null,
			features: [],
		};
		if (pointOptions && pointOptions.id) {
			featureSet.id = pointOptions.id;
		}
		if (pointOptions && pointOptions.bbox) {
			featureSet.bbox = pointOptions.bbox;
		}
		featureSet.features = geomapFeatures;
		return featureSet;
	}

	/**
	 * Creates a geomap line feature based on given set of coordinates.
	 *
	 * @param aPointsCoordinates
	 * @param oProps
	 * @param oOpts
	 */
	static geomapLine(aPointsCoordinates: Array<PointCoordinatesType>, oProps?: any, oOpts?: any) {
		const oValidity: IValidity = GeomapGeometryUtil.geomapLineValidate(aPointsCoordinates);
		if (!oValidity.bValid) {
			throw new Error(oValidity.sMsg);
		}

		const geomapObject = {
			type: "LineString",
			coordinates: aPointsCoordinates,
		};
		return this.geomapCreateFeature(geomapObject, oProps, oOpts);
	}

	/**
	 * Creates a collection of geomap lines based on a given set of coordinates
	 *
	 * @param aPointsCoordinates
	 * @param oProps
	 * @param oOpts
	 */
	static geomapLines(aPointsCoordinates: Array<Array<PointCoordinatesType>>, oProps?: any, oOpts?: any) {
		return this.geomapFeatureSet(aPointsCoordinates.map((pointCoords: Array<PointCoordinatesType>) => {
			return this.geomapLine(pointCoords, oProps);
		}), oOpts);
	}

	/**
	 * Transforms set of coordinates to geomap feature based on the input type
	 *
	 * @param sGeomType
	 * @param aCoords
	 */
	static transformToGeometricType(sGeomType: string, aCoords: PointCoordinatesType | Array<PointCoordinatesType>): any {
		let oGeomObj;

		if (sGeomType === "Point") {
			oGeomObj = this.geomapPoint(aCoords as PointCoordinatesType);
		} else if (sGeomType === "LineString") {
			oGeomObj = this.geomapLine(aCoords as Array<PointCoordinatesType>);
			/* } else if (sGeomType === "Polygon") {
				//
			} else if (sGeomType === "MultiPolygon") {
				// */
		} else {
			throw new Error("Given geometry type is not correct. Please make sure you provide correct geometry type!");
		}
		return oGeomObj.geometry;
	}

	/**
	 * Calculates distance between geomap features
	 *
	 * @param geojson
	 * @param oOpts
	 */
	static geomapCalculateDistance(geojson: GeomapGeoJSON, oOpts: object) {
		return this.geomapGeoJSONSegmentsIterator(geojson, (previousValue: number, segment: F) => {
			const oCoords = segment.geometry ? segment.geometry.coordinates : null;
			if (oCoords && oCoords.length) {
				return previousValue + GeomapGeometryUtil.pointDistance(
					oCoords[0] as unknown as Position,
					oCoords[1] as Position,
					oOpts,
				);
			}
		}, 0);
	}

	/**
	 * Similar to Array.reduce() we're reducing segments in given GeoJSON object.
	 * When two line segments or rays meet, they form an angle.
	 * By definition, when two lines meet to form an angle, a vertex is formed.
	 * Important: Points does not have segments.
	 *
	 * @param oGeoJSON
	 * @param callback function
	 * @param initialValue
	 */
	static geomapGeoJSONSegmentsIterator(oGeoJSON: GeoJSON | GeomapGeoJSON, callback: any, initialValue: number) {
		let previousValue = initialValue;
		let started = false;
		this.geometryGeoJSONIterator(
			oGeoJSON,
			(
				currentSegment: any,
				featureIndex: any,
				multiFeatureIndex: any,
				geometryIndex: any,
				segmentIndex: any,
			) => {
				if (started === false && initialValue === undefined) { previousValue = currentSegment; } else {
					previousValue = callback(
						previousValue,
						currentSegment,
						featureIndex,
						multiFeatureIndex,
						geometryIndex,
						segmentIndex,
					);
				}
				started = true;
			},
		);
		return previousValue;
	}

	/**
	 * Iterating over GeoJSON object similar to Array.forEach().
	 *
	 * @param oGeoJSON
	 * @param callback
	 */
	static geometryGeoJSONIterator(oGeoJSON: GeoJSON | GeomapGeoJSON, callback: any) {
		this.geometryFlat(oGeoJSON, (oFeature: any, iFeatureIndex: number, iMultiFeatureIndex: number) => {
			let iSegmentIndex = 0;

			// Excluding null geometries
			if (!oFeature.geometry) { return; }
			const sGeometryType = oFeature.geometry.type;
			if (sGeometryType === "Point") { return; } // point features does not have segments

			// Generate 2-vertex line segments - when two line segments or rays meet, they form an angle. By definition, when two lines meet to form an angle, a vertex is formed.
			let previousCoords: undefined;
			let ifPrevFeatureIndex = 0;
			let ifPrevMultiIndex = 0;
			let iPrevGeomIndex = 0;
			if (
				this.geometryCoordinatesIterator(
					oFeature,
					(
						currentCoord: any,
						iCoordIndex: any,
						featureIndexCoord: any,
						iMultiPartIndexCoord: any,
						iGeometryIndex: any,
					) => {
						if (
							previousCoords === undefined
							|| iFeatureIndex > ifPrevFeatureIndex
							|| iMultiPartIndexCoord > ifPrevMultiIndex
							|| iGeometryIndex > iPrevGeomIndex
						) {
							previousCoords = currentCoord;
							ifPrevFeatureIndex = iFeatureIndex;
							ifPrevMultiIndex = iMultiPartIndexCoord;
							iPrevGeomIndex = iGeometryIndex;
							iSegmentIndex = 0;
							return;
						}
						const currentSegment = this.geomapLine(
							[previousCoords, currentCoord] as Array<PointCoordinatesType>,
							oFeature.properties,
						);
						if (
							callback(
								currentSegment,
								iFeatureIndex,
								iMultiFeatureIndex,
								iGeometryIndex,
								iSegmentIndex,
							) === false
						) { return false; }
						iSegmentIndex++;
						previousCoords = currentCoord;
					},
				) === false
			) { return false; }
		});
	}

	/**
	 * Similar to Array.forEach - iterates over flattened features in given GeoJSON object.
	 *
	 * @param oGeoJSON
	 * @param callback
	 */
	static geometryFlat(oGeoJSON: GeoJSON | GeomapGeoJSON, callback: any) {
		this.geometryIterate(oGeoJSON, (geometry: any, iFeatureIndex: number, oProps: any, bbox: BBox, id: any) => {
			// Callback for single geometry
			const aSupportedTypes = ["Point", "LineString"],
				geomType: string = geometry === null ? null : geometry.type;
			let iIndex = 0;

			if (aSupportedTypes.indexOf(geomType) > -1) {
				if (
					callback(
						this.geomapCreateFeature(geometry, oProps, { bbox, id }),
						iFeatureIndex,
						0,
					) === false
				) { return false; }
				return;
			}

			for (
				iIndex;
				iIndex < geometry.coordinates.length;
				iIndex++
			) {
				const coordinate = geometry.coordinates[iIndex];
				const geom = {
					type: geomType,
					coordinates: coordinate,
				};
				if (
					callback(this.geomapCreateFeature(geom, oProps), iFeatureIndex, iIndex) === false
				) { return false; }
			}
		});
	}

	static getFeatureData<T extends GeoJSON.Feature>(oGeoJSON: GeoJSON | GeomapGeoJSON, index: number, bIsFeatureCollection: boolean, bIsFeature: boolean): T {
		if (bIsFeatureCollection) {
			// @ts-ignore
			return oGeoJSON.features[index] as T;
		}
		if (bIsFeature) {
			return oGeoJSON as T;
		}
		return {
			geometry: oGeoJSON, properties: {}, bbox: undefined, id: undefined,
		} as T;
	}

	/**
	 * Iterating over each geometry in given GeoJSON object.
	 *
	 * @param oGeoJSON
	 * @param callback
	 */
	static geometryIterate(oGeoJSON: GeoJSON | GeomapGeoJSON, callback: any) {
		const bIsFeatureCollection = oGeoJSON.type === "FeatureCollection",
			bIsFeature = oGeoJSON.type === "Feature",
			stop = bIsFeatureCollection ? oGeoJSON.features.length : 1;

		let i,
			j,
			featureIndex = 0;

		for (i = 0; i < stop; i++) {
			const feature = this.getFeatureData(oGeoJSON, i, bIsFeatureCollection, bIsFeature) as F;
			const {
				geometry, properties: featureProperties, bbox: featureBBox, id: featureId,
			} = feature;

			if (geometry === null) {
				if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false) {
					return false;
				}
				// eslint-disable-next-line no-continue
				continue;
			}

			switch (geometry.type) {
			case "Point":
			case "LineString":
				if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false) {
					return false;
				}
				break;
			case "GeometryCollection":
				for (j = 0; j < geometry.geometries.length; j++) {
					if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false) {
						return false;
					}
				}
				break;
			default:
				throw new Error("Given geometry type is not correct. Please make sure you provide correct geometry type");
			}

			featureIndex++;
		}
	}

	static getGeometry(oGeoJSON: any, featureIndex: number, bIsFeatureCollection: boolean, bIsFeature: boolean) {
		if (bIsFeatureCollection) {
			// @ts-ignore
			return oGeoJSON.features[featureIndex].geometry as unknown as G;
		}
		if (bIsFeature) {
			// @ts-ignore
			return oGeoJSON.geometry as unknown as G;
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return oGeoJSON;
	}

	/**
	 * Iterating over coordinates in given GeoJSON object similar.
	 *
	 * @param oGeoJSON
	 * @param callback
	 */
	static geometryCoordinatesIterator(oGeoJSON: any, callback?: any, excludeWrapCoord?: any) {
		// we should add some validation here on the oGeoJSON argument
		let geometry,
			stopG,
			aCoordinates,
			oPossibleGeometryCollection,
			iCoordIndex = 0,
			isGeometryCollection;
		const sGeometryType = oGeoJSON.type,
			bIsFeatureCollection = sGeometryType === "FeatureCollection",
			bIsFeature = sGeometryType === "Feature",
			stop = bIsFeatureCollection ? oGeoJSON.features.length : 1;

		const processCoords = (coords: any = [], wrap: number = 0, featureIndex: number = 0, multiFeatureIndex: number = 0, geometryIndex: number = 0) => {
			for (let i = 0; i < coords.length - wrap; i++) {
				if (callback(coords[i], iCoordIndex++, featureIndex, multiFeatureIndex, geometryIndex) === false) {
					return false;
				}
			}
			return true;
		};

		for (let featureIndex = 0; featureIndex < stop; featureIndex++) {
			oPossibleGeometryCollection = this.getGeometry(oGeoJSON, featureIndex, bIsFeatureCollection, bIsFeature);

			// eslint-disable-next-line no-continue
			if (!oPossibleGeometryCollection) { continue; } // Skip null geometries

			stopG = isGeometryCollection
				? oPossibleGeometryCollection.geometries.length
				: 1;

			isGeometryCollection = oPossibleGeometryCollection.type === "GeometryCollection";

			for (let geomIndex = 0; geomIndex < stopG; geomIndex++) {
				let multiFeatureIndex = 0;
				let geometryIndex = 0;
				geometry = isGeometryCollection
					? oPossibleGeometryCollection.geometries[geomIndex]
					: oPossibleGeometryCollection;

				// Handles null Geometry -- Skips this geometry
				// eslint-disable-next-line no-continue
				if (geometry === null) { continue; }
				aCoordinates = geometry.coordinates;
				const geomType = geometry.type;

				const wrapShrink = excludeWrapCoord
					&& (geomType === "Polygon" || geomType === "MultiPolygon")
					? 1
					: 0;

				if (!geomType) {
					break;
				}

				switch (geomType) {
				case "Point":
					return processCoords([aCoordinates], 0, featureIndex, multiFeatureIndex, geometryIndex) && (multiFeatureIndex++, true);

				case "LineString":
				case "MultiLineString":
					if (!processCoords(aCoordinates, 0, featureIndex, multiFeatureIndex, geometryIndex)) { return false; }
					if (geomType === "LineString") { multiFeatureIndex++; }
					return true;

				case "Polygon":
					aCoordinates.forEach((ring: any) => {
						if (!processCoords(ring, wrapShrink, featureIndex, multiFeatureIndex, geometryIndex)) { return false; }
						geometryIndex++;
					});
					multiFeatureIndex++;
					return true;

				case "MultiPolygon":
					aCoordinates.forEach((poly: any) => {
						geometryIndex = 0;
						poly.forEach((ring: any) => {
							if (!processCoords(ring, wrapShrink, featureIndex, multiFeatureIndex, geometryIndex)) { return false; }
							geometryIndex++;
						});
						multiFeatureIndex++;
					});
					return true;

				default:
					throw new Error("Geometry type is not correct. Please make sure you provide a correct geometry type.");
				}
			}
		}
	}

	/**
	 * Creates geomap Polygon Feature based on input arguments - an Array of LinearRings.
	 *
	 * @param pointCoords
	 * @param pointProps
	 * @param pointOptions
	 * @returns Geomap Polygon Feature
	 * const polygon = geomapPolygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
	 */
	static geomapPolygon(pointCoords: PolygonCoordinatesType, pointProps?: any, pointOptions?: any): F {
		 const oValidity: IValidity = GeomapGeometryUtil.geomapPolygonValidate(pointCoords);
		if (!oValidity.bValid) {
			throw new Error(oValidity.sMsg);
		}

		let i,
			j,
			aRing: MultiplePointsCoordinatesType,
			aCoords;

		for (i = 0, aCoords = pointCoords; i < aCoords.length; i++) {
			aRing = aCoords[i] as unknown as MultiplePointsCoordinatesType;
			if (aRing.length < 4) {
				throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
			}
			for (j = 0; j < aRing[aRing.length - 1].length; j++) {
				// Check if first point of Polygon contains two numbers
				if (aRing[aRing.length - 1][j] !== aRing[0][j]) {
					throw new Error("First and last Position are not equivalent.");
				}
			}
		}

		const geomapObj = {
			type: "Polygon",
			coordinates: pointCoords,
		};
		return this.geomapCreateFeature(geomapObj, pointProps, pointOptions);
	}

	/**
	 * Creates a geomap Polygon feature set from an Array of Polygon coordinates.
	 *
	 * @param pointsCoords an array of Polygon coordinates
	 * @param pointProps
	 * @param pointOptions
	 * @returns FeatureCollection of Polygon Geometry Features
	 * const polygons = geomapPolygons([
	 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
	 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
	 * ]);
	 *
	 */
	static geomapPolygons(pointsCoords: Array<PolygonCoordinatesType>, pointProps: any, pointOptions: any): FeatureSetType {
		return this.geomapFeatureSet(pointsCoords.map((aCoords: PolygonCoordinatesType) => {
			return this.geomapPolygon(aCoords, pointProps);
		}), pointOptions);
	}

	static geomapBearing(oStartPoint: PointCoordinatesType, oEndPoint: PointCoordinatesType, oOptions?: any): number {
		// Reverse calculation
		if (oOptions && oOptions.final === true) {
			return this.calculateFinalBearing(oStartPoint, oEndPoint);
		}
		const coordinates1 = GeomapGeometryUtil.getPointCoordinates(oStartPoint),
			coordinates2 = GeomapGeometryUtil.getPointCoordinates(oEndPoint),
			lon1 = GeomapGeometryUtil.convertPointCoordinatesFromDegreesToRadians(coordinates1[0]),
			lon2 = GeomapGeometryUtil.convertPointCoordinatesFromDegreesToRadians(coordinates2[0]),
			lat1 = GeomapGeometryUtil.convertPointCoordinatesFromDegreesToRadians(coordinates1[1]),
			lat2 = GeomapGeometryUtil.convertPointCoordinatesFromDegreesToRadians(coordinates2[1]),
			a = Math.sin(lon2 - lon1) * Math.cos(lat2),
			b = Math.cos(lat1) * Math.sin(lat2)
			- Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
		return GeomapGeometryUtil.convertPointCoordinatesFromtRadiansToDegrees(Math.atan2(a, b));
	}

	/**
	 * Calculates Final Bearing
	 *
	 * @param oStartPoint starting Point
	 * @param oEndPoint ending Point
	 * @returns bearing
	 */
	static calculateFinalBearing(oStartPoint: PointCoordinatesType, oEndPoint: PointCoordinatesType): number {
		// Swap between starting & ending points
		const start = oEndPoint;
		const end = oStartPoint;
		let bear: number = this.geomapBearing(start, end);
		bear = (bear + 180) % 360;
		return bear;
	}

	/**
	 * Calculates location of a destination point given a distance in
	 * degrees, radians, miles, or kilometers; and bearing in degrees from a given geomap Point.
	 *
	 * @param pointOrigin starting point
	 * @param iDistance distance from the origin point
	 * @param iBearing ranging from -180 to 180
	 * @param oOpts Optional parameters
	 * @returns destination point as Point Feature
	 * const oPoint = geomapPoint([-75.343, 39.984]);
	 * const iDistance = 50;
	 * const iBearing = 90;
	 * const oOptions = {units: 'miles'};
	 *
	 * const destination = calculatePointDestination(oPoint, iDistance, iBearing, oOptions);
	 */
	static calculatePointDestination(pointOrigin: PointCoordinatesType | F, iDistance: number, iBearing: number, oOpts: any) {
		const pointDestination = GeomapGeometryUtil.calculateDestination(pointOrigin, iDistance, iBearing, oOpts);
		return this.geomapPoint([pointDestination.lng, pointDestination.lat] as PointCoordinatesType, pointDestination.opts);
	}

	/**
	 * Returns a geomap Point at a specified distance along the line by given geomap LineString Feature.
	 *
	 * @param oLine input line of type Geomap Line Feature
	 * @param iDistance distance along the line
	 * @param oOpts Optional parameters
	 * @returns Geomap Feature Point `distance` `units` along the line
	 * const line = geomapLine([[-83, 30], [-84, 36], [-78, 41]]);
	 * const options = {units: 'miles'};
	 *
	 * var along = geomapAlong(line, 200, options);
	 */
	static geomapAlong(oLine: LineStringFeatureType, iDistance: any, oOpts: any) {
		if (oOpts === undefined) {
			oOpts = {};
		} // defaulting

		const oGeometry = GeomapGeometryUtil.extractGeomapGeometry(oLine),
			aCoordinates = oGeometry.coordinates as PointCoordinatesType[];
		let i,
			iOvershot,
			iDirection,
			interpolated,
			iTravelled = 0;
		for (i = 0; i < aCoordinates.length; i++) {
			if (iDistance >= iTravelled && i === aCoordinates.length - 1) {
				break;
			} else if (iTravelled >= iDistance) {
				iOvershot = iDistance - iTravelled;
				if (!iOvershot) {
					return this.geomapPoint(aCoordinates[i]);
				}
				iDirection = this.geomapBearing(aCoordinates[i], aCoordinates[i - 1]) - 180;
				interpolated = this.calculatePointDestination(aCoordinates[i], iOvershot, iDirection, oOpts);
				return interpolated;
			} else {
				iTravelled += GeomapGeometryUtil.pointDistance(aCoordinates[i], aCoordinates[i + 1], oOpts);
			}
		}
		return this.geomapPoint(aCoordinates[aCoordinates.length - 1]);
	}

	/**
	 * Calculates the circle polygon given a radius in degrees, radians, miles, or kilometers; and steps for precision by taking a geomap Point.
	 *
	 * @param oCenterPoint center point
	 * @param iRadius radius of the circle
	 * @param oOpts Optional parameters
	 * @returns circle polygon
	 * const center = [-75.343, 39.984];
	 * const radius = 5;
	 * const options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
	 * const circle = geomapCircle(center, radius, options);
	 *
	 */
	static geomapCircle(oCenterPoint: PointCoordinatesType | F, iRadius: number, oOpts?: any): F {
		if (oOpts === undefined) {
			oOpts = {};
		} // defaulting

		// default params
		const steps = oOpts.steps || 64;
		let oProps = {};
		if (oOpts.properties) {
			oProps = oOpts.properties;
		} else if (!Array.isArray(oCenterPoint) && oCenterPoint.type === "Feature" && oCenterPoint.properties) {
			oProps = oCenterPoint.properties;
		}

		// main
		const aCoords = [];
		for (let i = 0; i < steps; i++) {
			aCoords.push(this.calculatePointDestination(oCenterPoint, iRadius, (i * -360) / steps, oOpts).geometry
				.coordinates);
		}
		aCoords.push(aCoords[0]);
		return this.geomapPolygon([aCoords] as PolygonCoordinatesType, oProps);
	}

	/**
	 * Takes one or more features and calculates the centroid using the mean of all vertices.
	 * This lessens the effect of small islands and artifacts when calculating the centroid of a set of polygons.
	 *
	 * @param geojson GeoJSON to be centered
	 * @param oOpts Optional Parameters
	 * @returns Geomap Point - the centroid of the input features
	 * const polygon = geomapPolygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
	 *
	 * const centroid = geomapCentroid(polygon);
	 *
	 */
	static geomapCentroid(geojson: GeoJSON, oOpts?: any) {
		if (oOpts === undefined) {
			oOpts = {};
		} // defaulting

		let xSum = 0,
			ySum = 0,
			len = 0;
		this.geometryCoordinatesIterator(geojson, (aCoords: any) => {
			xSum += aCoords[0];
			ySum += aCoords[1];
			len++;
		}, true);
		return this.geomapPoint([xSum / len, ySum / len], oOpts.properties);
	}

	static NotSelfIntersectingValidation(feature: GeoJSONStoreFeatures) {
		return ValidateNotSelfIntersecting(feature); // eslint-disable-line @typescript-eslint/no-unsafe-return
	}
}
