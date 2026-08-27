import type { BBox, FeatureCollection } from "geojson";
import { Geometry, Position } from "geojson";
import { Feature as MapLibreFeature } from "../MapLibre.js";

type Units = "meters" | "millimeters" | "centimeters" | "kilometers" | "acres" | "miles" | "nauticalmiles" | "inches" | "yards" | "feet" | "radians" | "degrees" | "hectares";

type FeatureProperties = {
	[_: string]: any;
};

type GeomapFeatureExtended = Omit<GeomapFeature, "type"> & {
	type?: 0 | 1 | 2 | 3 | "Unknown" | "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon" | "Feature";
};

type F = GeomapFeatureExtended & {
	id?: any,
	geometry: G;
	bbox?: BBox,
}
// hacky workaround to remove readonly from the base type
type GeomapFeature = {
	-readonly [key in keyof MapLibreFeature]: MapLibreFeature[key];
}

type G = Geometry & {
	coordinates: Position | Position[] | Position[][] | Position[][][];
}

type GeomapGeoJSON = G | F | FeatureCollection;

export {
	FeatureProperties, F, G, Geometry, Position, MapLibreFeature, GeomapGeoJSON, Units, GeomapFeature,
};
