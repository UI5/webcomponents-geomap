import type { Position } from "geojson";
import slot from "@ui5/webcomponents-base/dist/decorators/slot.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import GeomapShape from "./GeomapShape.js";
import geomapProperty from "./decorators/geomapProperty.js";
import GeomapGeometry from "./geometry/GeomapGeometry.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import type GeomapPoint from "./GeomapPoint.js";
import type { F } from "./types/GeomapGeometryTypes.js";

type PolygonDragDropEndEventDetail = {
	polygon: F;
}

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-polygon` defines the Polygon webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapPolygon.js";`
 *
 * @constructor
 * @extends GeomapShape
 * @public
 */
@customElement("ui5-geomap-polygon")

/**
 * Fired when the polygon edit is finished.
 * @public
 * */
@event("polygon-dragndrop-end", {
	cancelable: true,
	bubbles: true,
})

class GeomapPolygon extends GeomapShape {
	eventDetails!: GeomapShape["eventDetails"] & {
		"polygon-dragndrop-end": PolygonDragDropEndEventDetail;
	}
	/**
	* Color of the fill of the layer of the polygon.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "fill-color" })
	fillColor = "black";
	/**
	* Outline color of the layer of the polygon.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "fill-outline-color" })
	outlineColor = "black";
	/**
	* Opacity of the layer of the polygon.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "fill-opacity" })
	opacity = 0.5;
	/**
	 * Describes if the polygon is draggable & editable.
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	dragndrop = false;

	/**
	* List of points that define the polygon. The first and the last points should always be the same.
	*
	* @public
	*/
	@slot({ type: HTMLElement, invalidateOnChildChange: true, "default": true })
	points!: Array<HTMLElement>;

	_handleAddDraggable: () => void;
	_finishDraggable: (e: any) => void;
	constructor() {
		super();
		this._handleAddDraggable = this.handleAddDraggable.bind(this);
		this._finishDraggable = this.finishDraggable.bind(this);
	}

	get pointsArr(): Array<Position> {
		// eslint-disable-next-line
		const points = this.points.map((point: any) => [point.lng, point.lat]);
		if (points.length) {
			return [...points, points[0]] as Array<Position>; // always end with the first point
		}
		return points;
	}

	/**
	* @override
	*/
	sourceUpdateNeeded(changeInfo: InvalidationInfo) {
		return changeInfo.type === "slot";
	}

	/**
	* @override
	*/
	get sourceData() {
		if (this.points.length < 3) {
			return {
				id: undefined,
				type: "Feature",
				properties: {},
				geometry: {
					type: "Polygon",
					coordinates: [],
				},
			};
		}
		return GeomapGeometry.geomapPolygon([this.pointsArr]);
	}

	/**
	* @override
	*/
	get layerType() {
		return "fill";
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

	addDrawer() {
		const data = this.sourceData;
		data.properties = {
			mode: "polygon",
			"isExistingFeature": true,
		};
		const draw = this.draw!;
		draw.start();
		draw.setMode("polygon");
		const id = draw.getFeatureId();
		this._internalState.id = id;
		data.id = id;
		draw.addFeatures([
			data,
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

		for (let i = 0; i < this.points.length; i++) {
			this.removeChild(this.points[i]);
		}

		for (let i = 0; i < selObj.geometry.coordinates[0].length; i++) {
			const pt = document.createElement("ui5-geomap-point") as GeomapPoint;
			pt.lng = selObj.geometry.coordinates[0][i][0];
			pt.lat = selObj.geometry.coordinates[0][i][1];
			this.appendChild(pt);
		}

		this.fireDecoratorEvent("polygon-dragndrop-end", {
			polygon: selObj,
		});
	}
}

GeomapPolygon.define();

export default GeomapPolygon;
