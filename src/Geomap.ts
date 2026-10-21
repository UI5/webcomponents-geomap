import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import slot from "@ui5/webcomponents-base/dist/decorators/slot.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import jsxRenderer from "@ui5/webcomponents-base/dist/renderer/JsxRenderer.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import type { Timeout } from "@ui5/webcomponents-base/dist/types.js";

import type { GeoJSON, Feature as GeoJSONFeature } from "geojson";
import type {
	LngLatBoundsLike,
	LngLatLike,
	RequestTransformFunction,
	MapMouseEvent,
	MapTouchEvent,
	Point2D,
} from "./MapLibre.js";

import {
	css, LngLat, LngLatBounds, setWorkerUrl,
} from "./MapLibre.js";
import Map from "./extensions/Map.js";
import GeomapDraw from "./utils/GeomapDraw.js";

// Template
import GeomapTemplate from "./GeomapTemplate.js";

import { getWorkerPath, getClickDelay } from "./config/Config.js";
import type { FeatureId, GeoJSONStoreFeatures } from "terra-draw/dist/store/store";

// Styles
import GeomapCss from "./generated/themes/Geomap.css.js";
import type GeomapProvider from "./GeomapProvider.js";
import type GeomapHssProvider from "./GeomapHssProvider.js";
import type GeomapLayer from "./GeomapLayer.js";
import type Feature from "./Feature.js";
import GeomapGeometry from "./geometry/GeomapGeometry.js";
import type {
	GeomapFeatureType, PointCoordinatesType, PolygonCoordinatesType,
} from "./geometry/GeomapGeometryTypes.js";
import type { F } from "./types/GeomapGeometryTypes.js";
import GeomapGeometryUtil from "./geometry/GeomapGeometryUtil.js";
import type GeomapSpot from "./GeomapSpot.js";
import type GeomapSelectionControl from "./GeomapSelectionControl.js";
import { PulseAnimationUtil } from "./utils/PulseAnimationUtil.js";

const workerUrl = new URL("./generated/maplibre-gl-csp-worker.js", import.meta.url);

type mapElementCoordsType = LngLatLike & {
	item?: any;
	parent?: any;
};

type MapCenterEventDetail = {
	centerLng: number;
	centerLat: number;
}

type MapZoomEventDetail = {
	zoom: number;
}

type MapRotateEventDetail = {
	rotation: number;
}

type MapTiltEventDetail = {
	tilt: number;
}

type MapClickEventDetail = {
	lng: number;
	lat: number;
	point?: Point2D;
}

/** Detail for the map-dblclick event, mirroring MapClickEventDetail. */
type MapDblClickEventDetail = {
	lng: number;
	lat: number;
	point?: Point2D;
}

type MapMouseUpEventDetail = {
	lng: number;
	lat: number;
}

type MapMouseMoveEventDetail = {
	lng: number;
	lat: number;
}

type MapContextmenuEventDetail = {
	lng: number;
	lat: number;
}

const restrictedAreaProperties = [
	"restrictedAreaWestSouthPointLng",
	"restrictedAreaWestSouthPointLat",
	"restrictedAreaEastNorthPointLng",
	"restrictedAreaEastNorthPointLat",
];

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap` component is the main container of the Geomap webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/Geomap.js";`
 *
 * @constructor
 * @extends UI5Element
 * @public
 */
@customElement({
	tag: "ui5-geomap",
	template: GeomapTemplate,
	styles: [GeomapCss, css],
	renderer: jsxRenderer,
})

/**
* The user changed the center of the map (dragged or zoomed)
* @public
*/
@event("map-center")

/**
* The user zoomed the map
* @public
*/
@event("map-zoom")

/**
* The user rotated the map
* @public
*/
@event("map-rotate")

/**
* The user tilted the map
* @public
*/
@event("map-tilt")

/**
* The user clicked on the map
* @public
*/
@event("map-click", {
	cancelable: true,
})

/**
* The user double-clicked on the map
* @public
*/
@event("map-dblclick", {
	cancelable: true,
})

/**
* The user released the mouse button
* @public
*/
@event("map-mouseup", {
	cancelable: true,
})

/**
* The user moved the mouse over the map
* @public
*/
@event("map-mousemove")

/**
 * The user right-clicked on the map
 * @public
 * */
@event("map-contextmenu", {
	cancelable: true,
})

/**
* The map has finished loading
*/
@event("map-load")

/**
* The map has rendered/re-rendered
*/
@event("map-render")

/**
* The map's bounds have changed
* @public
*/
@event("map-bounds-change")

/**
 * The map has encountered an error
 * @public
 * */
@event("map-error", {
	cancelable: true,
})

/**
 * Fired when a selection is set programmatically via setSelection().
 * @public
 */
@event("selection-set")

class Geomap extends UI5Element {
	eventDetails!: {
		"map-center": MapCenterEventDetail;
		"map-zoom": MapZoomEventDetail;
		"map-rotate": MapRotateEventDetail;
		"map-tilt": MapTiltEventDetail;
		"map-click": MapClickEventDetail;
		"map-dblclick": MapDblClickEventDetail;
		"map-mouseup": MapMouseUpEventDetail;
		"map-mousemove": MapMouseMoveEventDetail;
		"map-contextmenu": MapContextmenuEventDetail;
		"map-load": void;
		"map-render": void;
		"map-bounds-change": void;
		"map-error": void;
		"selection-set": { feature: GeoJSONFeature };
	}
	/**
	* Describes the content of the map - provider, controls, markers, etc.
	*
	* @public
	*/
	@slot({ type: HTMLElement, individualSlots: true, "default": true })
	items!: Array<HTMLElement>;

	/**
	 * Describes the controls of the map
	 *
	 * @public
	 */
	@slot({ type: HTMLElement, individualSlots: true })
	mapControls!: Array<HTMLElement>;
	/**
	* Longitude of the point where the map is centered
	* @public
	*/
	@property({ type: Number })
	centerLng = 0;
	/**
	* Latitude of the point where the map is centered
	* @public
	*/
	@property({ type: Number })
	centerLat = 0;
	/**
	* Zoom level of the map - the bigger, the more the map is zoomed
	* @public
	*/
	@property({ type: Number })
	zoom = 2;
	/**
	* Rotation of the map in degrees, counter-clockwise from the north
	* @public
	*/
	@property({ type: Number })
	rotation = 0;
	/**
	* Tilt of the map in degrees (0-60) relative to the screen's plane
	* @public
	*/
	@property({ type: Number })
	tilt = 0;
	/**
	* Latitude of the West-South point, defining the map's restricted area
	* The restricted area is provided as a rectangle, defined by its bottom-left (West-South) and top-right (East-North) coordinates
	*
	* **Note:** Setting all 4 `restrictedArea` properties to 0 removes the restriction
	* @public
	*/
	@property({ type: Number })
	restrictedAreaWestSouthPointLng = 0;
	/**
	* Longitude of the West-South point, defining the map's restricted area
	* The restricted area is provided as a rectangle, defined by its bottom-left (West-South) and top-right (East-North) coordinates
	*
	* **Note:** Setting all 4 `restrictedArea` properties to 0 removes the restriction
	* @public
	*/
	@property({ type: Number })
	restrictedAreaWestSouthPointLat = 0;
	/**
	* Latitude of the West-South point, defining the map's restricted area
	* The restricted area is provided as a rectangle, defined by its bottom-left (West-South) and top-right (East-North) coordinates
	*
	* **Note:** Setting all 4 `restrictedArea` properties to 0 removes the restriction
	* @public
	*/
	@property({ type: Number })
	restrictedAreaEastNorthPointLng = 0;
	/**
	* Longitude of the West-South point, defining the map's restricted area
	* The restricted area is provided as a rectangle, defined by its bottom-left (West-South) and top-right (East-North) coordinates
	*
	* **Note:** Setting all 4 `restrictedArea` properties to 0 removes the restriction
	* @public
	*/
	@property({ type: Number })
	restrictedAreaEastNorthPointLat = 0;
	/**
	* The minimum allowed zoom level
	* @public
	*/
	@property({ type: Number })
	minZoom = 0;
	/**
	* The maximum allowed zoom level
	* @public
	*/
	@property({ type: Number })
	maxZoom = 24;
	/**
	* The minimum allowed tilt level
	* @public
	*/
	@property({ type: Number })
	minTilt = 0;
	/**
	* The maximum allowed tilt level
	* @public
	*/
	@property({ type: Number })
	maxTilt = 60;

	map: any;
	draw: any;
	_onStyleUpdate: () => void;
	_clickTimer: ReturnType<typeof setTimeout> | null;
	_pendingSelection: GeoJSONFeature | null = null;

	_exitTimeout?: Timeout;

	constructor() {
		super();
		this.map = null;
		this.draw = null;
		this._clickTimer = null;
		this._onStyleUpdate = this.onStyleUpdate.bind(this);
		this.attachInvalidate(this.handleInvalidation.bind(this));
	}

	_filterChildrenByTags(tags: any) {
		return [...this.children].filter(child => tags.some((tag: string) => child.hasAttribute(tag)));
	}

	get provider() {
		return this._filterChildrenByTags(["ui5-geomap-provider"]).length ? this._filterChildrenByTags(["ui5-geomap-provider"]) : this._filterChildrenByTags(["ui5-geomap-hss-provider"]);
	}

	/**
	 * Returns the shapes added to the map - spots & containers.
	 */
	get markers() {
		return this._filterChildrenByTags(["ui5-geomap-spot", "ui5-geomap-container"]);
	}

	/**
	 * Returns the sources added to the map.
	 */
	get sources() {
		return [...this.children].filter((child: any) => child.isGeomapSource === true);
	}

	/**
	 * Returns the layers added to the map.
	 */
	get layers() {
		return [...this.children].filter((child: any) => child.isGeoMapLayer === true) as GeomapLayer[];
	}

	/**
	 * Returns the controls added to the map.
	 */
	get controls() {
		return [...this.children].filter((child: any) => child.isGeoMapControl === true);
	}

	/**
	 * Returns the selection controls added to the map.
	 */
	get selectionControl() {
		return [...this.children].filter((child: any) => child.isSelectionMapControl && child.isSelectionMapControl === true);
	}

	/**
	 * Changes any combination of center, zoom, bearing, and pitch, animating the transition along a curve that evokes flight.
	* @public
	* @param lng Describes the longitude of the center.
	* @param lat Describe the latitude of the center.
	* @param zoom Describes the zoom level.
	*/
	flyTo(lng: number, lat: number, zoom: number): void {
		this.map.flyTo({
			center: [
				lng,
				lat,
			],
			essential: true,
			zoom,
		});
	}

	/**
	* Returns the canvas element of the map
	*
	* @default null
	* @public
	*/
	get canvas(): HTMLCanvasElement {
		return this.map.getCanvas() as HTMLCanvasElement;
	}

	/**
	* @public
	*/
	getLayersAt(point: any): any {
		const features: Array<Feature> = this.map.queryRenderedFeatures(point, {
			layers: this.layers.map(layer => layer._id),
		});

		return features.map((feature: Feature) => this.getLayerById(feature.layer.id as string));
	}

	/**
	 * Returns a layer by its id.
	 * @param id
	 */
	getLayerById(id: string): GeomapLayer | undefined {
		return this.layers.find(layer => layer._id === id);
	}

	get _provider(): GeomapProvider | GeomapHssProvider {
		return this.provider.length ? this.provider[0] as GeomapProvider | GeomapHssProvider : {} as GeomapProvider | GeomapHssProvider;
	}

	onStyleUpdate() {
		if (this.map) {
			let styleUrl = "";
			if (typeof this._provider?.styleUrl === "object") { // allow adding raster json as styleUrl
				styleUrl = this._provider.styleUrl;
			} else if (this._provider?.styleUrl?.indexOf("map-style") !== -1) { // workaround for providing local raster json... should improve this one
				styleUrl = this._provider.styleUrl;
			} else {
				styleUrl = this._provider.getStyle();
			}
			this.map.setStyle(styleUrl);
		}
	}

	onBeforeRendering() {
		this.provider.forEach((provider: any) => {
			provider.detachChangeHandler(this._onStyleUpdate);
			provider.attachChangeHandler(this._onStyleUpdate);
		});
	}

	async onEnterDOM() {
		if (this._exitTimeout) {
			clearTimeout(this._exitTimeout);
			this._exitTimeout = undefined;
		}
		if (!this.map) {
			await this.createMap();
			await this.connectToItems();
			await Promise.resolve(); // Let the elements inside ui5-geomap add themselves to the map instance first, as imperative code waiting for the map-load event might depend on them (f.e. on declarative sources)
			this.drawerInit();
			this.connectToDraw();
			if (this._pendingSelection) {
				const pending = this._pendingSelection;
				this._pendingSelection = null;
				this.setSelection(pending);
			}
			this.fireDecoratorEvent("map-load");
		}
	}

	onExitDOM() {
		if (this._clickTimer !== null) {
			clearTimeout(this._clickTimer);
			this._clickTimer = null;
		}
		if (this.map) {
			this._exitTimeout = setTimeout(() => {
				this.map?.remove();
				this.map = null;
			});
		}
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		if (!this.map) {
			return;
		}

		if (changeInfo.type === "property") {
			const name = changeInfo.name;

			if (name === "zoom") {
				this.map.setZoom(this.zoom);
			} else if (["centerLng", "centerLat"].includes(name)) {
				this.map.setCenter(new LngLat(this.centerLng, this.centerLat));
			} else if (name === "rotation") {
				this.map.setBearing(this.rotation);
			} else if (name === "tilt") {
				this.map.setPitch(this.tilt);
			} else if (restrictedAreaProperties.includes(name)) {
				this.map.setMaxBounds(this._getRestrictedArea());
			} else if (name === "minZoom") {
				this.map.setMinZoom(this.minZoom);
			} else if (name === "maxZoom") {
				this.map.setMaxZoom(this.maxZoom);
			} else if (name === "minTilt") {
				this.map.setMinPitch(this.minTilt);
			} else if (name === "maxTilt") {
				this.map.setMaxPitch(this.maxTilt);
			}
		} else if (changeInfo.type === "slot") {
			this.connectToItems();
			this.connectToDraw();
		}
	}

	async connectToItems() {
		this.items.forEach(this._connectToMap.bind(this));
		this.mapControls.forEach(this._connectToMap.bind(this));

		const p = new Promise<void>(resolve => {
			resolve();
		});

		return p;
	}

	connectToDraw() {
		if (!this.draw) {
			return;
		}
		this.items.forEach(this._connectToDraw.bind(this));
	}

	_connectToMap(item: any) {
		if (typeof item.connectToMap === "function") {
			item.connectToMap(this.map);
		}
	}

	_connectToDraw(item: any) {
		if (typeof item.connectToDraw === "function") {
			item.connectToDraw(this.draw);
		}
	}

	/**
	* Returns the map boundaries (for the visible viewport).
	* @public
	*/
	getBounds(): any {
		const bounds = this.map.getBounds();

		return {
			north: bounds.getNorth(),
			east: bounds.getEast(),
			south: bounds.getSouth(),
			west: bounds.getWest(),
		};
	}

	/**
	 *
	 * @private
	 */
	mapFactory() {
		const map = new Map({
			container: this.getDomRef()!,
			attributionControl: false,

			// Provider data
			style: this._provider.getStyle(),

			// Map navigation settings
			center: new LngLat(this.centerLng, this.centerLat),
			zoom: this.zoom,
			bearing: this.rotation,
			pitch: this.tilt,

			// Restrictions
			minZoom: this.minZoom,
			maxZoom: this.maxZoom,
			minPitch: this.minTilt,
			maxPitch: this.maxTilt,
			maxBounds: this._getRestrictedArea() as LngLatBoundsLike,
			transformRequest: this._provider.transformRequest.bind(this._provider) as RequestTransformFunction,
		});

		return map;
	}

	/**
	 * Tries to create new Worker with a given path.
	 * @param sPath
	 * @private
	 */
	_checkWorkerAllowed(sPath: string) {
		if (!sPath) {
			throw Error("No path provided.");
		}
		const worker = new Worker(sPath);
		return worker;
	}

	async createMap() {
		if (!this._provider.isValidConfiguration()) {
			throw new Error("Invalid configuration of the provider");
		}

		if (this._provider.isValidConfiguration()) {
			// fetch jwt token used for authorization
			await this._provider._fetchToken();
		}

		try {
			// Direct worker load
			this._checkWorkerAllowed(workerUrl.href);
			setWorkerUrl(workerUrl.href);
			this.map = this.mapFactory();
		} catch (e) {
			try {
				// Direct worker is not allowed. Load the worker via Blob.
				const sBase = workerUrl.origin;
				const sPath = workerUrl.href;
				const sBlobCode = `self.origin = "${sBase}"; importScripts("${sPath}");`;
				const sWorkerUrl = window.URL.createObjectURL(new Blob([sBlobCode]));

				this._checkWorkerAllowed(sWorkerUrl);
				setWorkerUrl(sWorkerUrl);
				this.map = this.mapFactory();
			} catch (oError) {
				// Bridge
				try {
					const url = new URL(getWorkerPath(), document.baseURI); // "worker" location
					url.searchParams.set("worker", workerUrl.href);

					// propagate to map
					setWorkerUrl(url.href);
				} catch (error) {
					throw Error("Error constructing URL for worker.");
				}
				this.map = this.mapFactory();
			}
		}

		[...this.getDomRef()!.querySelectorAll(".maplibregl-ctrl")].forEach(control => {
			control?.parentElement?.removeChild(control);
		});

		this.bindMapEvents();

		this.map._ui5GeomapPromise = new Promise<void>(resolve => {
			this.map.on("load", () => {
				resolve();
			});
		});

		return this.map._ui5GeomapPromise as Promise<void>;
	}

	drawerInit() {
		const selectionControl = this.selectionControl && this.selectionControl[0] as GeomapSelectionControl;

		if (selectionControl) {
			// already have instance of draw from selection control so we can reuse it
			const container = selectionControl._instance!._container;

			this.draw = container._terraDraw;

			selectionControl._instance!._container.addEventListener("selection-stop", () => {
				this.items.forEach((item: any) => {
					// if click is on a layer, do not remove the drawer
					if (item.stateDragging === true && typeof item.removeDrawer === "function") {
						item.removeDrawer();
					}
				});
			});
		} else {
			const draw = new GeomapDraw(this.map as Map, {});
			this.draw = draw.draw;
		}

		this.draw._ui5GeomapPromise = new Promise<void>(resolve => {
			resolve();
		});

		return this.draw._ui5GeomapPromise as Promise<void>;
	}

	_getRestrictedArea() {
		if (
			(this.restrictedAreaWestSouthPointLat === 0 && this.restrictedAreaEastNorthPointLat === 0)
			|| (this.restrictedAreaWestSouthPointLng === 0 && this.restrictedAreaEastNorthPointLng === 0)
		) {
			// If combination in between the crossed is having 0 values - no restriction as combination such as [[0, -10], [0, 10]] is not valid
			return undefined;
		}
		return [
			[this.restrictedAreaWestSouthPointLng, this.restrictedAreaWestSouthPointLat],
			[this.restrictedAreaEastNorthPointLng, this.restrictedAreaEastNorthPointLat],
		];
	}

	bindMapEvents() {
		// User zoomed - update zoom, centerLng, centerLat
		this.map.on("zoomend", () => {
			this.zoom = this.map.getZoom();
			const center = this.map.getCenter();
			this.centerLng = center.lng;
			this.centerLat = center.lat;
			this.fireDecoratorEvent("map-zoom", {
				zoom: this.zoom,
			});
			this.fireDecoratorEvent("map-center", {
				centerLng: this.centerLng,
				centerLat: this.centerLat,
			});
			this.fireDecoratorEvent("map-bounds-change");
		});

		// User dragged - update centerLng, centerLat
		this.map.on("dragend", () => {
			const center = this.map.getCenter();
			this.centerLng = center.lng;
			this.centerLat = center.lat;
			this.fireDecoratorEvent("map-center", {
				centerLng: this.centerLng,
				centerLat: this.centerLat,
			});
			this.fireDecoratorEvent("map-bounds-change");
		});

		// User rotated the map - update rotation
		this.map.on("rotateend", () => {
			this.rotation = this.map.getBearing();
			this.fireDecoratorEvent("map-rotate", {
				rotation: this.rotation,
			});
			this.fireDecoratorEvent("map-bounds-change");
		});

		// User tilted the map - update pitch
		this.map.on("pitchend", () => {
			this.tilt = this.map.getPitch();
			this.fireDecoratorEvent("map-tilt", {
				tilt: this.tilt,
			});
			this.fireDecoratorEvent("map-bounds-change");
		});

		this.map.on("click", (e: MapMouseEvent) => {
			if (this._clickTimer !== null) {
				clearTimeout(this._clickTimer);
				this._clickTimer = null;
			}
			const delay: number = getClickDelay();
			this._clickTimer = setTimeout(() => {
				this._clickTimer = null;
				if (this.map && !this.fireDecoratorEvent("map-click", {
					lng: e.lngLat.lng,
					lat: e.lngLat.lat,
					point: e.point,
				})) {
					e.preventDefault();
				}
			}, delay);
		});
		this.map.on("dblclick", (e: MapMouseEvent) => {
			if (this._clickTimer !== null) {
				clearTimeout(this._clickTimer);
				this._clickTimer = null;
			}
			if (!this.fireDecoratorEvent("map-dblclick", {
				lng: e.lngLat.lng,
				lat: e.lngLat.lat,
				point: e.point,
			})) {
				e.preventDefault();
			}
		});
		this.map.on("mousedown", (e: MapMouseEvent) => {
			const layers = this.getLayersAt(e.point);
			this.items.forEach((item: any) => {
				// if click is on a layer, do not remove the drawer
				const bShouldRemove = !layers.length || item.__id !== layers[0].__id;
				if (item.stateDragging === true && typeof item.removeDrawer === "function" && bShouldRemove) {
					item.removeDrawer();
				}
			});
		});
		this.map.on("touchstart", (e: MapTouchEvent) => {
			const layers = this.getLayersAt(e.point);
			this.items.forEach((item: any) => {
				// if click is on a layer, do not remove the drawer
				const bShouldRemove = !layers.length || item.__id !== layers[0].__id;
				if (item.stateDragging === true && typeof item.removeDrawer === "function" && bShouldRemove) {
					item.removeDrawer();
				}
			});
		});

		this.map.on("mouseup", (e: MapMouseEvent) => {
			if (!this.fireDecoratorEvent("map-mouseup", {
				lng: e.lngLat.lng,
				lat: e.lngLat.lat,
			})) {
				e.preventDefault();
			}
		});

		this.map.on("mousemove", (e: MapMouseEvent) => {
			if (!this.fireDecoratorEvent("map-mousemove", {
				lng: e.lngLat.lng,
				lat: e.lngLat.lat,
			})) {
				e.preventDefault();
			}
		});

		this.map.on("render", () => {
			this.fireDecoratorEvent("map-render");
		});

		this.map.on("contextmenu", (e: MapMouseEvent) => {
			if (!this.fireDecoratorEvent("map-contextmenu", {
				lng: e.lngLat.lng,
				lat: e.lngLat.lat,
			})) {
				e.preventDefault();
			}
		});

		this.map.on("error", (e: any) => {
			if (!this.fireDecoratorEvent("map-error")) {
				e.preventDefault();
			}
		});
	}

	/**
	 * Returns the elements of the map for selection and/or withing boundaries of the viewport.
	 * @param bSelection
	 * @param bBounds
	 */
	collectElements(bSelection: boolean = false, bBounds: boolean = false) {
		const result: Array<GeomapFeatureType> = [];
		const bounds: Array<PointCoordinatesType> = [];
		const availableSourceNames: Array<string> = [];

		// collect sources passed as geojson
		this.sources.forEach((source: any) => {
			availableSourceNames.push(source.id as string);
		});

		// collect internal sources from styles
		if (this.map.getStyle()) {
			const internalSources = Object.keys(this.map.getStyle().sources as Array<any>).filter(i => i.includes("ui5")); // created by us internally
			internalSources.forEach((source: any) => {
				availableSourceNames.push(source as string);
			});
		}

		// collect "marker" elements
		const markerElements: Array<GeomapFeatureType> = [];

		this.transformQueryMarkerElements(markerElements);

		if (bSelection) {
			this.collectElementsForSelection(availableSourceNames, markerElements, result);
		}
		if (bBounds) {
			this.collectElementsForBounds(availableSourceNames, markerElements, bounds);
		}
		return { result, bounds };
	}

	/**
	 * Transforms query elements to marker elements.
	 * @param markerElements
	 */
	transformQueryMarkerElements(markerElements: Array<GeomapFeatureType>) {
		const queryMarkerElements = this.shadowRoot!.querySelectorAll(".maplibregl-marker");
		if (queryMarkerElements.length) {
			queryMarkerElements.forEach((elmnt: any) => {
				const m = elmnt as GeomapSpot;
				if (elmnt.tagName === "SAP-GEOMAP-SPOT-COMPONENT") {
					const el = {
						type: "Feature",
						geometry: {
							type: "Point",
							coordinates: [m.lng, m.lat],
						},
					} as unknown as GeomapFeatureType;
					markerElements.push(el);
				}
			});
		}

		return markerElements;
	}

	/**
	 * Collects the elements for selection based on given sources and marker elements.
	 * @param availableSourceNames
	 * @param markerElements
	 * @param result
	 */
	collectElementsForSelection(availableSourceNames: Array<string>, markerElements: Array<GeomapFeatureType>, result: Array<GeomapFeatureType>) {
		const elements = this.map.queryRenderedFeatures(this.map.getBounds()).filter((i: any) => availableSourceNames.indexOf(i.source as string) > -1);

		const addGeometry = (element: GeomapFeatureType) => {
			if (element.geometry && element.geometry.coordinates) {
				result.push(element.geometry as unknown as GeomapFeatureType);
			}
		};

		elements.forEach(addGeometry);
		markerElements.forEach(addGeometry);

		return result;
	}

	/**
	 * Collects bounds based on given sources and marker elements.
	 * @param availableSourceNames
	 * @param markerElements
	 * @param bounds
	 */
	collectElementsForBounds(availableSourceNames: Array<string>, markerElements: Array<GeomapFeatureType>, bounds: Array<PointCoordinatesType>) {
		const elements = this.map.queryRenderedFeatures().filter((i: any) => availableSourceNames.indexOf(i.source as string) > -1);

		elements.forEach((element: GeomapFeatureType) => {
			if (element.geometry && element.geometry.coordinates) {
				if (element.geometry.type === "Polygon") {
					element.geometry.coordinates.forEach((coords: Array<PointCoordinatesType>) => {
						coords.forEach((point: PointCoordinatesType) => {
							bounds.push(point);
						});
					});
				} else if (element.geometry.type === "LineString") {
					element.geometry.coordinates.forEach((point: PointCoordinatesType) => {
						bounds.push(point);
					});
				} else {
					bounds.push(element.geometry.coordinates as PointCoordinatesType);
				}
			}
		});

		markerElements.forEach((element: GeomapFeatureType) => {
			if (element.geometry && element.geometry.coordinates) {
				bounds.push(element.geometry.coordinates as PointCoordinatesType);
			}
		});

		return bounds;
	}

	/**
	 * Zooms the map to the perfect level to display an area by its boundaries.
	 * @public
	 */
	perfectZoom(aBounds: Array<mapElementCoordsType>): void {
		const options = {
			padding: {
				top: 10, bottom: 25, left: 15, right: 5,
			},
		};

		if (aBounds && aBounds.length > 0) {
			const elementsBounds = aBounds.reduce((lngLatBounds: LngLatBounds, coord: LngLatLike) => {
				return lngLatBounds.extend(coord);
			}, new LngLatBounds(aBounds[0] as LngLatLike, aBounds[0] as LngLatLike));

			this.map.fitBounds(elementsBounds, options);
			return;
		}

		// ztodo: should check if the below logic is correct
		const { bounds } = this.collectElements(false, true);
		if (!bounds.length) {
			return;
		}

		this.map.fitBounds(bounds, options);
	}

	/**
	 *
	 * @param aBounds
	 * @private
	 */
	 _perfectZoomV2(aBounds: Array<mapElementCoordsType>) {
		const zoom = this.map.getZoom() - 1;
		const bounds = aBounds && aBounds.length > 0 ? aBounds : this.collectElements(false, true).bounds;
		const points = bounds.map((point: any) => [point.lng, point.lat] as PolygonCoordinatesType);

		if (!bounds.length) {
			return;
		}

		points.push(points[0]); // first and last point of the polygon should be the same
		const polygon = GeomapGeometry.geomapPolygon([points] as unknown as PolygonCoordinatesType);
		const center = GeomapGeometry.geomapCentroid(polygon as GeoJSON);
		this.map.flyTo(center);
		this.map.setZoom(zoom);
	}

	/**
	 * Returns the elements in given area (described as a polygon).
	 * @param area
	 * @public
	 */
	getElementsInSelectedArea(area: PolygonCoordinatesType): Array<F> {
		const element = this.collectElements(true).result;
		const inArea: Array<F> = [];

		const polygon = GeomapGeometry.geomapPolygon(area);

		element.forEach((feature: any) => {
			let pointF: F;
			if (feature.type && feature.type === "Point") {
				pointF = GeomapGeometry.geomapPoint([feature.coordinates[0], feature.coordinates[1]] as PointCoordinatesType);
				if (GeomapGeometryUtil.isPointInPolygon(pointF, polygon)) {
					inArea.push(feature as F);
				}
			} else if (feature.type && feature.type === "Polygon") {
				let allPointsInArea: boolean = true;
				feature.coordinates[0].forEach((point: F) => {
					if (!GeomapGeometryUtil.isPointInPolygon(point, polygon)) {
						allPointsInArea = false;
						return false;
					}
				});

				if (allPointsInArea) {
					inArea.push(feature as F);
				}
			} else if (feature.type && feature.type === "LineString") {
				let allPointsInArea: boolean = true;
				feature.coordinates.forEach((point: F) => {
					if (!GeomapGeometryUtil.isPointInPolygon(point, polygon)) {
						allPointsInArea = false;
						return false;
					}
				});

				if (allPointsInArea) {
					inArea.push(feature as F);
				}
			}
		});

		return inArea;
	}

	/**
	 * Triggers a pulsing circle animation around the spot for 5 seconds.
	 * The animation shows a circle with border that expands and fades out.
	 * (lnt, lat, size, animationspeed, direction)
	 * animation direction outside=>inside (& reversable)
	 * example usage: <map>.triggerPulseAnimation(9.5,49.4, 400, 1000, 1)
	 *
	 * @param lng Center longitude of the pulsing dot
	 * @param lat Center latitude of the pulsing dot
	 * @param size Size of the pulsing dot
	 * @param speed Animation speed
	 * @param direction Inside-Out or reverse
	 */
	triggerPulseAnimation(lng: number, lat: number, size: number = 200, speed: number = 1500, direction: 0 | 1 = 1) {
		PulseAnimationUtil.triggerPulseAnimation(this.map, {
			lng,
			lat,
			size,
			speed,
			direction,
		});
	}

	/**
	 * Sets one or more features as the active programmatic selection on the map.
	 *
	 * Accepted shape types and the required GeoJSON geometry for each:
	 *
	 * | `properties.mode` | geometry.type | Notes |
	 * |---|---|---|
	 * | `"point"` _(default for Point)_ | `Point` | `coordinates: [lng, lat]` |
	 * | `"linestring"` _(default for LineString)_ | `LineString` | `coordinates: [[lng,lat], …]` |
	 * | `"polygon"` _(default for Polygon)_ | `Polygon` | closed ring |
	 * | `"rectangle"` | `Polygon` | 5-point closed ring (4 corners + repeat of first) |
	 * | `"circle"` | `Polygon` | closed ring approximating the circle boundary |
	 *
	 * When `properties.mode` is omitted the mode is derived from the geometry type
	 * (`Point` → `"point"`, `LineString` → `"linestring"`, `Polygon` → `"polygon"`).
	 * For `"circle"` and `"rectangle"` you must pass `properties.mode` explicitly
	 * together with a valid `Polygon` geometry.
	 *
	 * Calling `setSelection` again replaces the previous programmatic selection.
	 * Fires the `selection-set` event after the feature is added.
	 *
	 * @param feature - A single GeoJSON Feature
	 * @public
	 */
	setSelection(feature: GeoJSONFeature): void {
		if (!this.draw) {
			this._pendingSelection = feature;
			return;
		}

		this.removeSelection();

		if (!this.draw.enabled) {
			this.draw.start();
		}

		// Maps terra-draw mode name → the GeoJSON geometry type it requires.
		const modeToGeometry: Record<string, string> = {
			point: "Point",
			linestring: "LineString",
			polygon: "Polygon",
			rectangle: "Polygon",
			circle: "Polygon",
		};

		// Default mode when no explicit mode is provided, keyed by geometry type.
		const geometryToDefaultMode: Record<string, string> = {
			Point: "point",
			LineString: "linestring",
			Polygon: "polygon",
		};

		const geometryType = feature.geometry.type;
		const explicitMode = feature.properties?.mode as string | undefined;
		const mode = explicitMode ?? geometryToDefaultMode[geometryType] ?? "polygon";

		// Validate that the supplied geometry matches what terra-draw expects for this mode.
		const expectedGeometry = modeToGeometry[mode];
		if (expectedGeometry && geometryType !== expectedGeometry) {
			// eslint-disable-next-line no-console
			console.warn(`[ui5-geomap] setSelection: mode "${mode}" requires ${expectedGeometry} geometry, got ${geometryType}`);
			return;
		}

		const id = this.draw.getFeatureId();
		const addedFeature: GeoJSONFeature = {
			type: "Feature",
			id,
			geometry: feature.geometry,
			properties: {
				...(feature.properties ?? {}),
				mode,
				isProgrammaticFeature: true,
			},
		};
		this.draw.addFeatures([addedFeature as GeoJSONStoreFeatures]);
		this.draw.selectFeature(id as FeatureId);

		this.fireDecoratorEvent("selection-set", { feature: addedFeature });
	}

	/**
	 * Returns the current programmatic selection features as GeoJSON Features.
	 *
	 * @returns Array of GeoJSON Features currently set via setSelection
	 * @public
	 */
	getSelection(): GeoJSONFeature[] {
		if (!this.draw) {
			return [];
		}
		const snapshot: GeoJSONStoreFeatures[] = this.draw.getSnapshot() as GeoJSONStoreFeatures[];
		return snapshot
			.filter(f => f.properties?.isProgrammaticFeature)
			.map(f => ({
				type: "Feature" as const,
				geometry: f.geometry as GeoJSONFeature["geometry"],
				properties: (f.properties ?? {}) as GeoJSONFeature["properties"],
			}));
	}

	/**
	 * Removes all programmatically-added selection features from the map.
	 *
	 * @public
	 */
	removeSelection(): void {
		this._pendingSelection = null;
		if (!this.draw) {
			return;
		}
		const snapshot: GeoJSONStoreFeatures[] = this.draw.getSnapshot() as GeoJSONStoreFeatures[];
		const programmaticFeature = snapshot.find(
			(feature: GeoJSONStoreFeatures) => feature.properties?.isProgrammaticFeature,
		);
		if (programmaticFeature) {
			this.draw.deselectFeature(programmaticFeature.id as FeatureId);
			this.draw.removeFeatures([programmaticFeature.id as FeatureId]);
		}
	}

	/**
	* Captures the current map view and returns it as a data URL.
	* The result includes both the WebGL map canvas and HTML marker overlays (spots).
	* @param type MIME type of the output image (default: "image/png")
	* @param quality Compression quality 0–1, applies to lossy formats like "image/jpeg"
	* @public
	*/
	takeScreenshot(type: string = "image/png", quality?: number): Promise<string> {
		if (!this.map) {
			return Promise.reject(new Error("Map is not initialized"));
		}
		return new Promise((resolve, reject) => {
			const onRender = () => {
				try {
					const mapCanvas = this.canvas;
					const { width, height } = mapCanvas;
					const output = document.createElement("canvas");
					output.width = width;
					output.height = height;
					const ctx = output.getContext("2d")!;
					ctx.drawImage(mapCanvas, 0, 0);

					const canvasRect = mapCanvas.getBoundingClientRect();
					const dpr = canvasRect.width > 0 ? width / canvasRect.width : 1;

					this.markers
						.filter((m): m is GeomapSpot => m.tagName === "SAP-GEOMAP-SPOT")
						.forEach(spot => {
							const spotComponent = spot.markerInstance.getElement() as Element & { shadowRoot: ShadowRoot | null };
							const pathD = spotComponent.shadowRoot
								?.querySelector("ui5-icon")
								?.shadowRoot?.querySelector("path")
								?.getAttribute("d");
							if (!pathD) {
								return;
							}

							const markerRect = spot.markerInstance.getElement().getBoundingClientRect();
							const w = markerRect.width * dpr;
							const h = markerRect.height * dpr;
							const x = (markerRect.left - canvasRect.left) * dpr;
							const y = (markerRect.top - canvasRect.top) * dpr;

							ctx.save();
							ctx.translate(x, y);
							ctx.scale(w / 16, h / 16);
							ctx.fillStyle = spot.color || "currentColor";
							ctx.fill(new Path2D(pathD));
							ctx.restore();
						});

					resolve(output.toDataURL(type, quality));
				} catch (e) {
					reject(e);
				}
			};
			this.map.once("render", onRender);
			this.map.triggerRepaint();
		});
	}
}

Geomap.define();

export type {
	MapCenterEventDetail,
	MapZoomEventDetail,
	MapRotateEventDetail,
	MapTiltEventDetail,
	MapClickEventDetail,
	MapMouseUpEventDetail,
	MapMouseMoveEventDetail,
	MapContextmenuEventDetail,
};
export default Geomap;
