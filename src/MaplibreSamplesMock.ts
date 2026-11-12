// maplibre-gl v6 is ESM-only and no longer registers a `window.maplibregl` global,
// so the website playground imports the classes directly from the mocked module.
// The `mocked-samples-maplibre-gl` specifier is remapped by the Editor import map
// to the ESM build (maplibre-gl.mjs).
export {
	FullscreenControl,
	LngLat,
	Map,
	Marker,
	ScaleControl,
	LngLatBounds,
	ImageSource,
	GeoJSONSource,
	MapMouseEvent,
	MapTouchEvent,
} from "mocked-samples-maplibre-gl";

export const setWorkerUrl = () => {};
