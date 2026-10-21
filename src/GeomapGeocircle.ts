import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import type {
	Units,
} from "./types/GeomapGeometryTypes.js";
import GeomapShape from "./GeomapShape.js";
import geomapProperty from "./decorators/geomapProperty.js";
import GeomapGeometry from "./geometry/GeomapGeometry.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import type { GeomapPoint, PolygonCoordinatesType } from "./geometry/GeomapGeometryTypes.js";
import type { GeoJSON } from "geojson";
import GeomapGeometryUtil from "./geometry/GeomapGeometryUtil.js";

const STEPS = 50;
type GeocircleDragDropEndEventDetail = {
	centerLng: number;
	centerLat: number;
	radius: number;
}

/**
 * @class
 *
  * ### Overview
 *
 * The `ui5-geomap-geocircle` defines the Geo Circle webcomponent.
 * GeomapGeocircle represents circles, defined in a real-world units (km, miles, etc.).
 * Rendered on the map as layers.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapGeocircle.js";`
 *
 * @constructor
 * @extends GeomapShape
 * @public
 */
@customElement("ui5-geomap-geocircle")

/**
 * Fired when the geocircle edit is finished.
 * @public
 * */
@event("geocircle-dragndrop-end", {
	cancelable: true,
	bubbles: true,
})

class GeomapGeocircle extends GeomapShape {
	eventDetails!: GeomapShape["eventDetails"] & {
		"geocircle-dragndrop-end": GeocircleDragDropEndEventDetail;
	}
	/**
	* Describes the longitude of the center of the geo-circle.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	lng = 0;
	/**
	* Describes the latitude of the center of the geo-circle.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	lat = 0;
	/**
	* Describes the radius of the geo-circle.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	radius = 0;
	/**
	* Describes the units in which the radius is measured.
	* @default "kilometers"
	* @public
	*/
	@property({ type: String })
	units = "kilometers";
	/**
	* Describes the color of the fill of the geo-circle.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "fill-color" })
	fillColor = "black";
	/**
	* Describes the outline color of the geo-circle.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "fill-outline-color" })
	outlineColor = "black";
	/**
	* Describes the opacity of the fill of the geo-circle.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "fill-opacity" })
	opacity = 0.5;
	/**
	 * Describes if the geocircle is draggable & editable.
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	dragndrop = false;

	_handleAddDraggable: () => void;
	_finishDraggable: (e: any) => void;
	_removeDrawer: (e: any) => void;
	constructor() {
		super();
		this._handleAddDraggable = this.handleAddDraggable.bind(this);
		this._finishDraggable = this.finishDraggable.bind(this);
		this._removeDrawer = this.removeDrawer.bind(this);
	}

	/**
	* @override
	*/
	sourceUpdateNeeded(changeInfo: InvalidationInfo) {
		if (changeInfo.type === "property") {
			const propName = changeInfo.name;
			return ["lng", "lat", "radius", "units"].includes(propName);
		}

		return false;
	}

	/**
	* @override
	*/
	get sourceData() {
		return GeomapGeometry.geomapCircle([this.lng, this.lat], this.radius, { steps: STEPS, units: this.units as Units });
	}

	/**
	* @override
	*/
	get layerType() {
		return "fill";
	}

	addDrawer() {
		const data = this.sourceData;
		data.properties = {
			mode: "circle",
			radiusKilometers: this.radius,
			"isExistingFeature": true,
		};

		const draw = this.draw!;

		const coordinates = data.geometry.coordinates;
		const id = draw.getFeatureId();
		this._internalState.id = id;
		data.id = id;

		draw.start();
		draw.setMode("circle");

		draw.addFeatures([
			{
				id,
				"type": "Feature",
				"geometry": {
					"type": "Polygon",
					"coordinates": coordinates,
				},
				"properties": {
					"mode": "circle",
					"radiusKilometers": this.radius,
					"isExistingFeature": true,
				},
			},
		]);
		draw.setMode("select");

		draw.on("finish", this._finishDraggable);
	}

	finishDraggable(e: any): void {
		const id = this._internalState.id;
		const draw = this.draw!;
		if (e !== id) {
			return;
		}

		// update the points
		const snapshot = draw.getSnapshot();
		const selObj = snapshot.find(feature => feature.id === id);
		if (!selObj) {
			return;
		}

		const polygon = GeomapGeometry.geomapPolygon([selObj.geometry.coordinates[0]] as unknown as PolygonCoordinatesType);
		const centroId = GeomapGeometry.geomapCentroid(polygon as GeoJSON);
		const p = selObj.geometry.coordinates[0][0] as unknown as GeomapPoint;
		const radius = GeomapGeometryUtil.pointDistance(centroId, p, { units: this.units });

		this.lng = centroId.geometry.coordinates[0] as unknown as number;
		this.lat = centroId.geometry.coordinates[1] as unknown as number;
		this.radius = radius;

		this.fireDecoratorEvent("geocircle-dragndrop-end", {
			centerLng: this.lng,
			centerLat: this.lat,
			radius: this.radius,
		});
	}
	handleAddDraggable() {
		this._internalState.dragging = true;
		this.addDrawer();
	}

	/**
	 * @override
	 */
	attachDragAndDrop() {
		if (this.dragndrop) {
			super.handleDraggable("fill-color", this.fillColor, this._handleAddDraggable);
		}
	}

	removeDrawer() {
		const draw = this.draw!;
		if (!this._internalState.id) {
			return;
		}
		draw.removeFeatures([this._internalState.id]);
		this._internalState.dragging = false;
		// detach listeners
		draw.off("finish", this._finishDraggable);
	}
}

GeomapGeocircle.define();

export default GeomapGeocircle;
