import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import type UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import type { AddLayerObject } from "maplibre-gl/dist/maplibre-gl-csp.js";
import type {
	FilterSpecification,
	LngLatLike,
	MapLayerEventType,
} from "./MapLibre.js";
import GeomapDisplayedFeatures from "./types/GeomapDisplayedFeatures.js";
import GeomapElement from "./GeomapElement.js";
import Cluster from "./Cluster.js";
import geomapProperty from "./decorators/geomapProperty.js";
import type GeomapProperty from "./types/GeomapPropertyType.js";
import Feature from "./Feature.js";
import type { F } from "./Feature.js";
import type { MapClickEventDetail, MapMouseMoveEventDetail, MapMouseUpEventDetail } from "./Geomap.js";
import { getSelectionStyles } from "./config/Config.js";
import { customElement } from "@ui5/webcomponents-base/dist/decorators.js";
import GeomapInteger from "./converters/GeomapInteger.js";

interface PropertyMetadata {
	[key: string]: any; // Define the structure of property metadata
}

type CustomEventData = {
	lng: any,
	lat: any,
	x: any,
	y: any,
	dom: HTMLElement,
	features: any,
	cluster: Cluster | undefined;
}

export type NestedArray<T> = Array<T | NestedArray<T>>;

type Metadata = {
	zIndex: number,
};

type LayerTypes = "symbol" | "fill" | "line" | "circle" | "heatmap" | "fill-extrusion" | "raster" | "hillshade" | "background";

type Options = {
	id: string,
	source: any,
	type: LayerTypes,
	metadata: Metadata,
	minzoom?: number,
	maxzoom?: number,
	filter?: NestedArray<string>
}

/**
 * Layer clicked
 *
 * @public
 */
@event("layer-click")

/**
 * Mouse entered layer
 *
 * @public
 */
@event("layer-mouseenter")

/**
 * Mouse moved in the layer
 *
 * @public
 */
@event("layer-mousemove")

/**
 * Mouse left the layer
 *
 * @public
 */
@event("layer-mouseleave")

/**
 * Mouse button down on the layer
 *
 * @public
 */
@event("layer-mousedown")

/**
 * Mouse button up on the layer
 *
 * @public
 */
@event("layer-mouseup")

/**
 * GeomapLayerBase
 *
 * @constructor
 * @extends GeomapElement
 * @public
 */
@customElement("ui5-geomap-layer-base")
class GeomapLayerBase extends GeomapElement {
	eventDetails!: {
		"layer-click": MapClickEventDetail;
		"layer-mouseenter": CustomEventData;
		"layer-mousemove": MapMouseMoveEventDetail;
		"layer-mouseleave": CustomEventData;
		"layer-mousedown": CustomEventData;
		"layer-mouseup": MapMouseUpEventDetail;
	}
	/**
	* When the map's zoom property is less than this value, the layer will be hidden.
	* Accepts values between 0 and 24.
	*
	* @default 0
	* @public
	*/
	@property({ type: Number })
	minZoom = 0;
	/**
	* When the map's zoom property is equal to, or greater than this value, the layer will be hidden
	* Accepts values between 0 and 24.
	*
	* @default 0
	* @public
	*/
	@property({ type: Number })
	maxZoom = 0;

	/**
	* When set, only features, matching the filter, will be displayed
	*
	* @default {}
	* @public
	*/
	@property({ type: Object })
	filter = {};

	/**
	* Determines which features the layer will display - All (default), only not-clustered, or only clustered
	* <b>Note:</b> This property is ignored if the <code>filter</code> property is set
	* <b>Note:</b> This property only makes sense when the layer is used for clustering (displays data from a <code>ui5-geomap-cluster-source</code> element)
	* @public
	*/
	@property()
	displayedFeatures: `${GeomapDisplayedFeatures}` = "All";

	/**
	* Determines if the layer is hidden.
	* @default false
	* @public
	*/
	@geomapProperty({
		type: Boolean, layout: "visibility", noExpression: true, formatter: (value: boolean) => { return value ? "none" : "visible"; },
	})
	hidden = false;
	/**
	* Describes the zIndex of the layer. The layer with the highest zIndex will be on top.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	zIndex = 0;

	/**
	* Describes the width of the layer.
	* @default undefined
	* @public
	*/
	@geomapProperty({ converter: GeomapInteger, type: Number, paint: "line-width" })
	width?: number | null = undefined;

	_internalState: {
		dragging: boolean,
		id: string | null,
	};

	/**
	 * Sort layers by the metadata zIndex property
	 */
	_fnSorter = (layer1: Options, layer2: Options) => {
		if (layer1.metadata.zIndex < layer2.metadata.zIndex) {
			return -1;
		}
		if (layer1.metadata.zIndex > layer2.metadata.zIndex) {
			return 1;
		}
		return 0;
	};

	constructor() {
		super();
		this.attachInvalidate(this.handleInvalidation.bind(this));
		this._internalState = {
			dragging: false,
			id: null,
		};
	}

	async onEnterDOM() {
		await this.whenMapConnected();
		await this.whenMapLoaded();
		await this.whenDrawConnected();
		this.createLayer();
		this.updateLayerProperties();
		this.attachDragAndDrop && this.attachDragAndDrop(); // not ok in this hook
	}

	onExitDOM() {
		if (this.map) {
			this.removeLayer();
		}
		super.onExitDOM();
	}

	_getInsertBeforeLayerId() {
		// @ts-ignore
		const allLayers = this.map?.getStyle().layers.filter((layer: any) => layer.metadata && layer.metadata.zIndex !== undefined).sort(this._fnSorter);
		const firstLayerWithBiggerZIndex = allLayers?.find((layer: any) => layer.metadata.zIndex > this.zIndex);
		return firstLayerWithBiggerZIndex ? firstLayerWithBiggerZIndex.id : undefined;
	}

	_getEffectiveFilter(): NestedArray<string> | undefined {
		if (Array.isArray(this.filter) && this.filter.length > 0) {
			return this.filter as NestedArray<string>; // filter used,  highest priority
		}

		if (this.displayedFeatures === GeomapDisplayedFeatures.NotClustered) {
			return ["!", ["has", "point_count"]];
		}

		if (this.displayedFeatures === GeomapDisplayedFeatures.Clustered) {
			return ["has", "point_count"];
		}
	}

	createLayer() {
		const options: Options = {
			"id": this._id,
			"source": this.layerSource,
			"type": this.layerType as LayerTypes,
			"metadata": {
				zIndex: this.zIndex,
			},
		};

		// Set minZoom, if set
		if (this.minZoom !== undefined) {
			options.minzoom = this.minZoom;
		}

		// Set maxZoom, if set
		if (this.maxZoom !== undefined) {
			options.maxzoom = this.maxZoom;
		}

		// Set filter/displayedFeatures, if set (filter takes precedence)
		const effectiveFilter = this._getEffectiveFilter();
		if (effectiveFilter !== undefined) {
			options.filter = effectiveFilter;
		}

		this.map?.addLayer(options as AddLayerObject, this._getInsertBeforeLayerId());

		// Bind for all needed events
		const events: (keyof MapLayerEventType)[] = ["click", "mouseenter", "mousemove", "mouseleave", "mousedown", "mouseup"];
		events.forEach(eventName => {
			this.map?.on(eventName, this._id, (e: any) => {
				if (!this.map) {
					return;
				}
				const marker = this.map.getHelperMarker(eventName === "click" ? "click" : "hover");
				marker.setLngLat(e.lngLat as LngLatLike);
				const prevented = !this.fireDecoratorEvent(`layer-${eventName}` as keyof (typeof this.eventDetails), {
					lng: e.lngLat.lng,
					lat: e.lngLat.lat,
					x: e.point.x,
					y: e.point.y,
					dom: marker.getElement(),
					features: e.features ? e.features.map((feature: F) => new Feature(this.map, this.map?.getSource(this.layerSource), feature)) : undefined,
					cluster: e.features && e.features[0] && Cluster.isCluster(e.features[0] as F) ? new Cluster(this.map, this.map.getSource(this.layerSource), e.features[0] as F) : undefined,
				});
				if (prevented) {
					e.preventDefault();
				}
			});
		});

		// Layers are lost upon style change
		this.map?.on("styledata", () => {
			if (this.map && !this.map.getLayer(this._id)) {
				this.createLayer();
				this.updateLayerProperties();
			}
		});
	}

	removeLayer() {
		this.map?.removeLayer(this._id);
	}

	updateLayerProperties() {
		for (const [prop, value] of Object.entries(this.paintProperties)) { // eslint-disable-line
			this.map?.setPaintProperty(this._id, prop, value === "" ? undefined : value); // "" is not accepted
		}

		for (const [prop, value] of Object.entries(this.layoutProperties)) { // eslint-disable-line
			this.map?.setLayoutProperty(this._id, prop, value === "" ? undefined : value);
		}
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		if (!this.map || !this.map.getLayer(this._id)) {
			return;
		}

		if (changeInfo.type === "property") {
			const propName = changeInfo.name;
			const propData: GeomapProperty = (this.constructor as typeof UI5Element).getMetadata().getProperties()[propName];

			if (propName === "filter" || propName === "displayedFeatures") {
				this.map.setFilter(this._id, this._getEffectiveFilter() as FilterSpecification);
			} else if (propName === "minZoom" || propName === "maxZoom") {
				this.map.setLayerZoomRange(this._id, this.minZoom, this.maxZoom);
			} else if (propName === "zIndex") {
				this.map.moveLayer(this._id, this._getInsertBeforeLayerId());
			} else if (propData.paint) {
				const value = this._getPropertyValue(propName as keyof this, propData);
				this.map.setPaintProperty(this._id, propData.paint, value === "" ? undefined : value); // "" is not accepted
			} else if (propData.layout) {
				const value = this._getPropertyValue(propName as keyof this, propData) as keyof this;
				this.map.setLayoutProperty(this._id, propData.layout, value === "" ? undefined : value); // "" is not accepted
			}
		}
	}

	getFocusDomRef(): HTMLElement {
		return this.map!.getHelperMarker("click").getElement();
	}

	get layerSource(): string {
		return "";
	}

	get sourceData(): any {
		return { type: "Feature" };
	}

	/**
	* Layer type ("line", "fill", etc...)
	*/
	get layerType() {
		return "";
	}

	get stateDragging() {
		return this._internalState.dragging;
	}

	_getPropertyValue(prop: keyof this, propData: PropertyMetadata): any {
		if (propData.formatter) {
			return propData.formatter(this[prop]);
		}
		return this[prop];
	}

	_getPropertiesOfType(type: string): { [key: string]: any } {
		const result: { [key: string]: any } = {};
		const props = (this.constructor as typeof UI5Element).getMetadata().getProperties();

		Object.keys(props).forEach(propName => {
			if (Object.prototype.hasOwnProperty.call(props, propName)) {
				const propData: PropertyMetadata = props[propName];
				if (propData[type]) {
					const value: any = this._getPropertyValue(propName as keyof this, propData);
					if (value !== undefined) {
						result[propData[type]] = value;
					}
				}
			}
		});

		return result;
	}

	attachDragAndDrop(): void {}

	/**
	 * Handles moving the figure over the map
	 * @param sPaintProperty property name that is used to paint the figure(layer)
	 * @param sColor
	 * @param fnHandler callback executed mousedown/touchstart
	 */
	handleDraggable(sPaintProperty: string | undefined, sColor: string | undefined, fnHandler: undefined | (() => void)): void {
		if (!sPaintProperty || !sColor || !fnHandler) {
			return;
		}
		const shapeColor = sColor;
		const shapeColorHover = getSelectionStyles().dragndropHover;

		const layer = this.__id;
		const canvas = this.map!.getCanvasContainer();
		this.map!.on("mouseenter", layer!, () => {
			this.map!.setPaintProperty(layer!, sPaintProperty, `#${shapeColorHover}`);
			canvas.style.cursor = "move";
		});

		this.map!.on("mouseleave", layer!, () => {
			this.map!.setPaintProperty(layer!, sPaintProperty, shapeColor);
			canvas.style.cursor = "";
		});

		this.map!.on("mousedown", layer!, e => {
			// Prevent the default map drag behavior.
			e.preventDefault();

			if (this._internalState.dragging) {
				// already dragging
				return;
			}
			canvas.style.cursor = "grab";
			fnHandler();
		});

		this.map!.on("touchstart", layer!, e => {
			if (e.points.length !== 1) { return; }

			// Prevent the default map drag behavior.
			e.preventDefault();
			fnHandler();
		});
	}

	get paintProperties() {
		return this._getPropertiesOfType("paint");
	}

	get layoutProperties() {
		return this._getPropertiesOfType("layout");
	}

	get isGeoMapLayer() {
		return true;
	}

	/**
	* Returns the layer object in maplibre
	* @default {}
	* @public
	*/
	get layer(): any {
		return this.map?.getLayer(this._id);
	}
}

export default GeomapLayerBase;
