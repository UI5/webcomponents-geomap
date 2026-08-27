import slot from "@ui5/webcomponents-base/dist/decorators/slot.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import type {
	Units,
	Position,
} from "./types/GeomapGeometryTypes.js";
import GeomapShape from "./GeomapShape.js";
import geomapProperty from "./decorators/geomapProperty.js";
import GeomapGeometry from "./geometry/GeomapGeometry.js";
import type {
	LineStringFeatureType,
} from "./geometry/GeomapGeometryTypes.js";
import type GeomapPoint from "./GeomapPoint.js";
import { getSelectionStyles, setSelectionStyles } from "./config/Config.js";

type LineDragDropEventDetail = {
	points: Array<Position>
}

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-line` defines the Line webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapLine.js";`
 *
 * @constructor
 * @extends GeomapShape
 * @experimental
 * @public
 */
@customElement("ui5-geomap-line")

/**
 * Fired when the polygon drag is finished.
 * @public
 * */
@event("line-dragndrop-end", {
	cancelable: true,
	bubbles: true,
})

class GeomapLine extends GeomapShape {
	eventDetails!: GeomapShape["eventDetails"] & {
		"line-dragndrop-end": LineDragDropEventDetail;
	}
	/**
	* Describes the color of the line.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "line-color" })
	color = "black";
	/**
	* Describes the width of the line.
	* @default 0
	* @public
	*/
	@geomapProperty({ type: Number, paint: "line-width" })
	width = 0;
	/**
	* Describes the opacity of the line.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "line-opacity" })
	opacity = 0.5;

	/**
	 * Describes if the line is draggable & editable.
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	dragndrop = false;

	/**
	* Points describing the line itself.
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
		return this.points.map((point: any) => [point.lng, point.lat]);
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
		if (this.points.length < 2) {
			return {
				id: undefined,
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: [],
				},
			};
		}

		return GeomapGeometry.geomapLine(this.pointsArr);
	}

	/**
	* @override
	*/
	get layerType() {
		return "line";
	}

	/**
	* @override
	*/
	get layoutProperties() {
		return {
			...super.layoutProperties,
			"line-join": "round",
		};
	}

	/**
	* @public
	*/
	getPointAt(distance: number, units: Units | undefined): any {
		// const point = along(GeomapGeometry.geomapLine(this.pointsArr) as unknown as LineString, distance, { units });
		const point = GeomapGeometry.geomapAlong(GeomapGeometry.geomapLine(this.pointsArr) as unknown as LineStringFeatureType, distance, { units });
		return {
			lng: point.geometry.coordinates[0],
			lat: point.geometry.coordinates[1],
		};
	}

	/**
	* @public
	*/
	getDistance(units: Units | undefined): number {
		return GeomapGeometry.geomapCalculateDistance(GeomapGeometry.geomapLine(this.pointsArr), { units });
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
			super.handleDraggable("line-color", this.color, this._handleAddDraggable);
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
			mode: "linestring",
			"isExistingFeature": true,
		};

		const draw = this.draw!;

		const oSelectionStyles = { ...getSelectionStyles() };
		oSelectionStyles.width = this.width;
		oSelectionStyles.fillColor = this.color;
		setSelectionStyles(oSelectionStyles, this.tagName.toLowerCase());

		const id = draw.getFeatureId();
		this._internalState.id = id;
		data.id = id;
		draw.start();
		draw.setModeStyles("select", oSelectionStyles); // reapply
		draw.setMode("linestring");
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

		for (let i = 0; i < selObj.geometry.coordinates.length; i++) {
			const pt = document.createElement("ui5-geomap-point") as GeomapPoint;
			pt.lng = selObj.geometry.coordinates[i][0];
			pt.lat = selObj.geometry.coordinates[i][1];
			this.appendChild(pt);
		}

		this.fireDecoratorEvent("line-dragndrop-end", {
			points: this.pointsArr,
		});
	}
}

GeomapLine.define();

export default GeomapLine;
