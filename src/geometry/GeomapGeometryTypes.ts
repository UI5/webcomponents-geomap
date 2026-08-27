import type { BBox, Position } from "geojson";
import type { F } from "../types/GeomapGeometryTypes.js";

type IValidity = {
	bValid: boolean,
	sMsg: string
};

type PointCoordinatesType = Array<number>;
type MultiplePointsCoordinatesType = Array<PointCoordinatesType>;
type PolygonCoordinatesType = Array<MultiplePointsCoordinatesType>;
type DestinationPointType = {
	lng: number,
	lat: number,
	opts: any
};

type GeomapPoint = {
	type: "Point",
	coordinates: PointCoordinatesType
};

type GeomapFeatureType = {
	type: string,
	id?: string | null,
	bbox?: BBox,
	properties: object | null,
	geometry: {
		type?: string,
		coordinates: []
	}
};

type FeatureSetType = {
	type: string,
	bbox?: BBox,
	id?: string | null,
	features: Array<F>
};

type LineStringFeatureType = {
	type: "Feature",
	id?: any,
	bbox?: BBox,
	geometry: {
		type: string,
		coordinates: Position[]
	}
};

const Constants = {
	iRadiusOfEarth: 6371008.8,
};

enum GeometryBasis {
	centimeters = Constants.iRadiusOfEarth * 100,
	degrees = Constants.iRadiusOfEarth / 111325,
	feet = Constants.iRadiusOfEarth * 3.28084,
	inches = Constants.iRadiusOfEarth * 39.37,
	kilometers = Constants.iRadiusOfEarth / 1000,
	meters = Constants.iRadiusOfEarth,
	metres = Constants.iRadiusOfEarth,
	millimeters = Constants.iRadiusOfEarth * 1000,
	miles = Constants.iRadiusOfEarth / 1609.344,
	nauticalmiles = Constants.iRadiusOfEarth / 1852,
	radians = 1,
	yards = Constants.iRadiusOfEarth * 1.0936,
}

export {
	IValidity, PointCoordinatesType, GeomapFeatureType, FeatureSetType, GeomapPoint, GeometryBasis, PolygonCoordinatesType, MultiplePointsCoordinatesType, DestinationPointType, LineStringFeatureType,
};
