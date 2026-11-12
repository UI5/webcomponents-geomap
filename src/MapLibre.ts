// Runtime values (classes / functions) exported from maplibre-gl v6
import {
	FullscreenControl, GeoJSONSource, ImageSource, LngLat, LngLatBounds,
	Map, MapMouseEvent, MapTouchEvent, Marker, ScaleControl, setWorkerUrl,
} from "maplibre-gl";

// Type-only exports in maplibre-gl v6 — must be imported with `import type`
// so bundlers (Vite/esbuild) do not try to resolve them as runtime values.
import type {
	ControlPosition, Coordinates, FullscreenControlOptions, IControl,
	LngLatBoundsLike, LngLatLike, MapGeoJSONFeature, MapLayerEventType,
	MapOptions, MarkerOptions, PointLike, RequestTransformFunction, Unit,
} from "maplibre-gl";

// maplibre-gl v6 no longer re-exports these from its main entry; they live in the
// style-spec package (which maplibre-gl depends on transitively and we declare directly).
import type { Feature, FilterSpecification, Point2D } from "@maplibre/maplibre-gl-style-spec";

import css from "./generated/maplibre-gl.css.js";

export {
	setWorkerUrl, css,
	FullscreenControl, GeoJSONSource, ImageSource, LngLat, LngLatBounds,
	Map, MapMouseEvent, MapTouchEvent, Marker, ScaleControl,
};

export type {
	ControlPosition, Coordinates, Feature, FilterSpecification, FullscreenControlOptions,
	IControl, LngLatBoundsLike, LngLatLike, MapGeoJSONFeature, MapLayerEventType,
	MapOptions, MarkerOptions, Point2D, PointLike, RequestTransformFunction, Unit,
};
