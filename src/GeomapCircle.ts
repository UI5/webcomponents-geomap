import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import GeomapShape from "./GeomapShape.js";
import geomapProperty from "./decorators/geomapProperty.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import GeomapGeometry from "./geometry/GeomapGeometry.js";
import GeomapInteger from "./converters/GeomapInteger.js";
import { setSelectionStyles, getSelectionStyles } from "./config/Config.js";

type CircleDragDropEndEventDetail = {
	centerLng: number;
	centerLat: number;
	radius: number;
}

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-circle` defines the Circle webcomponent.
 * GeomapCircle represent circles, defined in screen units (pixels).
 * Rendered on the map as layers.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapCircle.js";`
 *
 * @constructor
 * @extends GeomapShape
 * @experimental
 * @public
 */
@customElement("ui5-geomap-circle")

/**
 * Fired when the circle edit is finished.
 * @public
 * */
@event("circle-dragndrop-end", {
	cancelable: true,
	bubbles: true,
})

class GeomapCircle extends GeomapShape {
	eventDetails!: GeomapShape["eventDetails"] & {
		"circle-dragndrop-end": CircleDragDropEndEventDetail;
	}
	/**
	* Describes the longitude of the center of the circle.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	lng = 0;
	/**
	* Describes the latitude of the center of the circle.
	* @default 0
	* @public
	*/
	@property({ type: Number })
	lat = 0;
	/**
	* Describes the radius of the circle.
	* @default 0
	* @public
	*/
	@geomapProperty({ type: Number, paint: "circle-radius" })
	radius = 0;
	/**
	* Describes the fill color of the circle.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "circle-color" })
	fillColor = "black";
	/**
	* Describes the outline color of the circle.
	* @default "black"
	* @public
	*/
	@geomapProperty({ type: String, paint: "circle-stroke-color" })
	outlineColor = "black";
	/**
	* Describes the width of the outline of the circle.
	* @default 0
	* @public
	*/
	@geomapProperty({ converter: GeomapInteger, type: Number, paint: "circle-stroke-width" })
	outlineWidth = 0;
	/**
	* Describes the opacity of the circle.
	* @default 0.5
	* @public
	*/
	@geomapProperty({ type: Number, paint: "circle-opacity" })
	opacity = 0.5;
	/**
	 * Describes if the circle is draggable & editable.
	 * @default false
	 * @public
	 */
	@property({ type: Boolean })
	dragndrop = false;

	_handleAddDraggable: () => void;
	_finishDraggable: (e: any) => void;
	constructor() {
		super();
		this._handleAddDraggable = this.handleAddDraggable.bind(this);
		this._finishDraggable = this.finishDraggable.bind(this);
	}

	/**
	* @override
	*/
	sourceUpdateNeeded(changeInfo: InvalidationInfo) {
		if (changeInfo.type === "property") {
			const propName = changeInfo.name;
			return ["lng", "lat"].includes(propName);
		}

		return false;
	}

	/**
	* @override
	*/
	get sourceData() {
		return GeomapGeometry.geomapPoint([this.lng, this.lat]);
	}

	/**
	* @override
	*/
	get layerType() {
		return "circle";
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
			super.handleDraggable("circle-color", this.fillColor, this._handleAddDraggable);
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
			mode: "point",
			"isExistingFeature": true,
		};

		const draw = this.draw!;
		const oSelectionStyles = { ...getSelectionStyles() };
		oSelectionStyles.width = this.radius;
		setSelectionStyles(oSelectionStyles, this.tagName.toLowerCase());
		draw.start();
		draw.setModeStyles("select", oSelectionStyles); // reapply
		draw.setMode("point");

		const id = draw.getFeatureId();
		this._internalState.id = id;
		data.id = id;
		draw.addFeatures([
			{
				id,
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [this.lng, this.lat],
				},
				"properties": {
					"mode": "point",
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

		this.lng = selObj.geometry.coordinates[0] as unknown as number;
		this.lat = selObj.geometry.coordinates[1] as unknown as number;

		this.fireDecoratorEvent("circle-dragndrop-end", {
			centerLng: this.lng,
			centerLat: this.lat,
			radius: this.radius,
		});
	}
}

GeomapCircle.define();

export default GeomapCircle;
