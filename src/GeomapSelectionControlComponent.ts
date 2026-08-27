import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import jsxRenderer from "@ui5/webcomponents-base/dist/renderer/JsxRenderer.js";
import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import {
	TerraDraw,
	TerraDrawFreehandMode,
	TerraDrawRectangleMode,
	TerraDrawCircleMode,
	TerraDrawPolygonMode,
	TerraDrawLineStringMode,
	TerraDrawSelectMode,
	TerraDrawPointMode,
} from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";
import type { Validation, OnFinishContext } from "terra-draw/dist/common";
import type { FeatureId, GeoJSONStoreFeatures } from "terra-draw/dist/store/store";

import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/cancel-share.js";
import "@ui5/webcomponents-icons/dist/draw-rectangle.js";
import "@ui5/webcomponents-icons/dist/circle-task.js";
import "@ui5/webcomponents-icons/dist/cursor-arrow.js";
import "@ui5/webcomponents-icons/dist/delete.js";

import type { Map } from "./MapLibre.js";
import GeomapSelectionControlTemplate from "./GeomapSelectionControlComponentTemplate.js";
import cssStyles from "./generated/themes/GeomapSelectionControlComponent.css.js";
import { getFullSelectionConfig, getSelectionStyles } from "./config/Config.js";
import type SelectionStylesConfigType from "./types/GeomapSelectionType.js";
import type GeomapSelectionMode from "./types/GeomapSelectionMode.js";

const DEFAULT_SELECTION_MODES: Array<`${GeomapSelectionMode}`> = [
	"freehand",
	"polygon",
	"rectangle",
	"circle",
	"select",
];

type SelectionFinishEventDetail = {
	id: FeatureId;
	context: OnFinishContext;
	snapshot: Array<GeoJSONStoreFeatures>;
};

type SelectionItemEventDetail = {
	id: FeatureId;
	snapshot: Array<GeoJSONStoreFeatures>;
	selObj?: GeoJSONStoreFeatures;
};

type DrawerStopEventDetail = {
	internal: boolean
};

type SelectionModeChangeEventDetail = {
	selectionMode: string
};

interface IStringIndex {
	[key: string]: { styles: any }
}

/**
 * @class
 *
 * <h3 class="comment-api-title">Overview</h3>
 *
 *
 * <h3>Usage</h3>
 *
 * <h3>CSS Shadow Parts</h3>
 *
 * <h3>ES6 Module Import</h3>
 *
 * @constructor
 * @extends UI5Element
 * @experimental
 * @public
 */
@customElement({
	tag: "ui5-geomap-selection-control-component",
	renderer: jsxRenderer,
	template: GeomapSelectionControlTemplate,
	styles: [cssStyles],
})

/**
 * Fired when selection is finished.
 *
 * @public
 * @param {FeatureId} id - The id of the selected feature
 * @param {OnFinishContext} context - The context of the selected feature
 * @param {Array<GeoJSONStoreFeatures>} snapshot - The snapshot of the selected feature
 */
@event("selection-finish", { bubbles: true })

/**
 * Fired when item is selected.
 *
 * @public
 * @param {FeatureId} id - The id of the selected feature
 * @param {Array<GeoJSONStoreFeatures>} snapshot - The snapshot of the selected feature
 * @param {GeoJSONStoreFeatures} selObj - The selected object
 */
@event("selection-item", { bubbles: true })

/**
 * Fired when selection stops.
 *
 * @public
 * @param {Boolean} internal - flag marks that event is fired internally
 */
@event("selection-stop", { bubbles: true, cancelable: true })
/**
 * Fired when selection mode changes.
 *
 * @public
 * @param {string} mode - the new selection mode
 */
@event("selection-mode-change", { bubbles: true })

class GeomapSelectionControlComponent extends UI5Element {
	eventDetails!: {
		"selection-finish": SelectionFinishEventDetail;
		"selection-item": SelectionItemEventDetail;
		"selection-stop": DrawerStopEventDetail;
		"selection-mode-change": SelectionModeChangeEventDetail;
	}
	/**
	 * Type of the selection used. Can be rectangle, freehand, polygon, circle or select.
	 * @default "rectangle"
	 * @public
	 */
	@property({ type: String })
	selectionType = "rectangle";

	/**
	 * The selection mode buttons that should be available to the user.
	 * When empty, all selection modes are rendered.
	 *
	 * Supported values: `freehand`, `polygon`, `rectangle`, `circle`, `select`.
	 *
	 * @public
	 */
	@property({ type: Array })
	modes: Array<`${GeomapSelectionMode}`> = [];

	_adapter!: TerraDrawMapLibreGLAdapter<Map>;
	_terraDraw!: TerraDraw;
	map!: Map;
	_validator: Validation = () => { return { valid: true, reason: undefined }; };

	_selectionStyles: IStringIndex;
	_selectionModes: any;
	_lastWarnedUnknownModes?: string;

	constructor() {
		super();

		const oStyles = getSelectionStyles();
		const oConfig = getFullSelectionConfig(oStyles);

		this._selectionStyles = oConfig.selectionStyles;
		this._selectionModes = oConfig.selectionModes;
	}

	async onEnterDOM() {
		await Promise.resolve();

		const oStyles = getSelectionStyles();
		const oConfig = getFullSelectionConfig(oStyles);

		this._selectionStyles = oConfig.selectionStyles;
		this._selectionModes = oConfig.selectionModes;

		this._adapter = new TerraDrawMapLibreGLAdapter({ map: this.map });
		this._terraDraw = new TerraDraw({
			adapter: this._adapter,
			modes: [new TerraDrawFreehandMode({ ...this._selectionStyles.freehand, ...this._selectionModes }),
				new TerraDrawRectangleMode({ ...this._selectionStyles.rectangle, ...this._selectionModes }),
				new TerraDrawCircleMode({ ...this._selectionStyles.circle, ...this._selectionModes }),
				new TerraDrawPolygonMode({ ...this._selectionStyles.polygon, ...this._selectionModes }),
				new TerraDrawLineStringMode({ ...this._selectionStyles.linestring, ...this._selectionModes }),
				new TerraDrawSelectMode({ ...this._selectionStyles.select, ...this._selectionModes }),
				new TerraDrawPointMode({ ...this._selectionStyles.point, ...this._selectionModes })],
		});

		this._terraDraw.on("finish", (id: FeatureId, context: OnFinishContext) => {
			const snapshot = this._terraDraw.getSnapshot();
			this.fireDecoratorEvent("selection-finish", {
				id,
				context,
				snapshot,
			});
		});

		this._terraDraw.on("select", (id: FeatureId) => {
			const snapshot = this._terraDraw.getSnapshot();
			// Search the snapshot for the selected polygon
			const selObj = snapshot.find(feature => feature.id === id);
			this.fireDecoratorEvent("selection-item", {
				id,
				snapshot,
				selObj,
			});
		});
	}

	onExitDOM() {
		if (this._terraDraw) {
			this.removeSelection();
		}
	}

	/**
	 * Starts the selection process. The user can select an area on the map.
	 * @param mode
	 */
	startSelection(mode?: keyof IStringIndex) {
		if (!this._terraDraw) {
			return;
		}
		if (mode) {
			this.selectionType = mode as string;
		}
		if (!this._checkEnabled()) {
			this._terraDraw.start();
		}
		this._terraDraw.setModeStyles(this.selectionType, this._selectionStyles[this.selectionType].styles);
		this._terraDraw.setMode(this.selectionType);
	}

	/**
	 * Ends the selection process.
	 */
	endSelection() {
		// ends selection by calling the stop method and returns the cursor to pointer
		if (!this._terraDraw) {
			return;
		}

		const features = this.getExistingFeatures();
		this._terraDraw.stop();
		this.handleExistingFeatures(features);
		this._adapter.setCursor("unset");
	}

	removeSelection() {
		// ends selection by calling the stop method and returns the cursor to pointer
		if (!this._terraDraw) {
			return;
		}

		const store = (this._terraDraw as any)._store.store;

		// eslint-disable-next-line guard-for-in,no-restricted-syntax
		for (const key in store) {
			if (store[key].properties && !store[key].properties.isExistingFeature) {
				this._terraDraw.removeFeatures([key as FeatureId]);
			}
		}

		this._adapter.setCursor("unset");
	}

	getExistingFeatures(): Array<GeoJSONStoreFeatures> {
		const store = (this._terraDraw as any)._store.store;
		const features: Array<GeoJSONStoreFeatures> = [];

		// eslint-disable-next-line guard-for-in,no-restricted-syntax
		for (const key in store) {
			if (store[key].properties && store[key].properties.isExistingFeature) {
				features.push(store[key] as GeoJSONStoreFeatures);
			}
		}

		return features;
	}

	handleExistingFeatures(features: Array<GeoJSONStoreFeatures>) {
		this._terraDraw.start();
		this.addExistingMapFeatures(features);
	}

	addExistingMapFeatures(features: Array<GeoJSONStoreFeatures>) {
		if (!this._terraDraw || !features) {
			return;
		}
		features.forEach((feature: GeoJSONStoreFeatures) => {
			this._terraDraw.addFeatures([feature]);
		});
	}

	setModeStyles(mode: string, styles: SelectionStylesConfigType) {
		if (!this._checkEnabled()) {
			return;
		}
		this._terraDraw.setModeStyles(mode, styles);
	}

	/**
	 * Update all selection styles - used for updating the styles of all selection modes at once used when the user changes the styles from the UI
	 * @param styles
	 */
	updateAllSelectionStyles(styles: any) {
		const keys = Object.keys(this._selectionStyles);
		keys.forEach(key => {
			this._selectionStyles[key].styles = styles;
		});
	}

	_checkEnabled(): boolean {
		return this._terraDraw && this._terraDraw.enabled;
	}

	/**
	 * Returns the selected areas.
	 */
	get selections() {
		return this._terraDraw.getSnapshot().map(content => { // eslint-disable-line @typescript-eslint/no-unsafe-return
			delete content.id;
			return content; // eslint-disable-line @typescript-eslint/no-unsafe-return
		});
	}

	/**
	 * Returns the selection mode buttons that are actually rendered.
	 * Pure getter — falls back to the full default list when `modes` is
	 * empty, missing, or contains only unknown values, returning a
	 * defensive copy so callers can't mutate the shared default.
	 */
	get effectiveModes(): Array<`${GeomapSelectionMode}`> {
		const source = Array.isArray(this.modes) ? this.modes : [];
		const filtered = source.filter(mode => DEFAULT_SELECTION_MODES.includes(mode));
		return filtered.length ? filtered : [...DEFAULT_SELECTION_MODES];
	}

	/**
	 * Logs a warning when `modes` contains values that are not part of the
	 * supported selection modes. Internal — called by the public control
	 * once per `modes` assignment. Deduplicates against the previous call so
	 * that an attribute parse + invalidation cycle (which can call this
	 * twice for the same value) only produces one warning.
	 *
	 * @private
	 */
	_validateModes(): void {
		const source = Array.isArray(this.modes) ? this.modes : [];
		const unknown = source.filter(mode => !DEFAULT_SELECTION_MODES.includes(mode));
		if (!unknown.length) {
			this._lastWarnedUnknownModes = undefined;
			return;
		}
		const signature = unknown.join("|");
		if (this._lastWarnedUnknownModes === signature) {
			return;
		}
		this._lastWarnedUnknownModes = signature;
		// eslint-disable-next-line no-console
		console.warn(
			`[ui5-geomap-selection-control] Unknown selection mode(s) ignored: ${unknown.join(", ")}.`
			+ ` Supported values: ${DEFAULT_SELECTION_MODES.join(", ")}.`,
		);
	}

	setValidator(fn: Validation) {
		this._validator = fn;
	}

	setSelectionMode(e: Event) {
		const target = e.target as HTMLElement;
		const mode = target.getAttribute("data-ui5-mode");
		if (!mode || !DEFAULT_SELECTION_MODES.includes(mode as `${GeomapSelectionMode}`)) {
			return;
		}
		this.startSelection(mode as `${GeomapSelectionMode}`);
		this.selectionType = mode;

		this.deselectAllOptions(target);
		target.setAttribute("design", "Emphasized");

		this.fireDecoratorEvent("selection-mode-change", {
			selectionMode: mode,
		});
	}

	startDraw() {
		this.startSelection();
	}

	endDraw(e: Event) {
		const target = e.target as HTMLElement;
		this.fireDecoratorEvent("selection-stop", {
			internal: true,
		});
		this.deselectAllOptions(target);
		this.endSelection();
	}

	deselectAllOptions(target?: HTMLElement) {
		const allButtons = (target?.parentNode as Element)?.getElementsByTagName("ui5-button");
		Array.from(allButtons || []).forEach(btn => {
			btn.setAttribute("design", "Default");
		});
	}
}

GeomapSelectionControlComponent.define();

export {
	SelectionFinishEventDetail,
	SelectionItemEventDetail,
	DrawerStopEventDetail,
	SelectionModeChangeEventDetail,
};

export default GeomapSelectionControlComponent;
