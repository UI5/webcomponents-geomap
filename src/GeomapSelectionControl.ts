import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import type { Validation } from "terra-draw/dist/common";
import GeomapControlBase from "./GeomapControlBase.js";
import GeomapSelectionControlWrapper from "./extensions/controls/GeomapSelectionControlWrapper.js";
import type { SelectionFinishEventDetail, SelectionItemEventDetail, SelectionModeChangeEventDetail } from "./GeomapSelectionControlComponent.js";
import { getSelectionStyles } from "./config/Config.js";
import type SelectionStylesConfigType from "./types/GeomapSelectionType.js";
import type GeomapSelectionMode from "./types/GeomapSelectionMode.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-selection-control` defines the Selection webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapSelectionControl.js";`
 *
 * @constructor
 * @extends GeomapControlBase
 * @experimental
 * @public
 */
@customElement({
	tag: "ui5-geomap-selection-control",
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

class GeomapSelectionControl extends GeomapControlBase<GeomapSelectionControlWrapper> {
	eventDetails!: {
		"selection-finish": SelectionFinishEventDetail;
		"selection-item": SelectionItemEventDetail;
	}
	/**
	 * Type of the selection used. Can be rectangle, freehand, polygon, circle or select.
	 * @default "rectangle"
	 * @public
	 */
	@property({ type: String })
	selectionType = "rectangle";

	/**
	 * The selection mode buttons that should be available to the end user.
	 * When empty, all selection modes are rendered.
	 *
	 * Supported values: `freehand`, `polygon`, `rectangle`, `circle`, `select`.
	 *
	 * The buttons render in the order given in the array. If the active
	 * `selectionType` is no longer rendered (because it was removed from
	 * `modes`), it is reassigned to the first button currently visible in
	 * the toolbar — this means the active type can stay unchanged even
	 * when `modes` is an empty array or contains only unknown values, since
	 * the visible toolbar then falls back to the full default list.
	 * Unknown values are dropped with a `console.warn`; if every supplied
	 * value is unknown, the full default list is used as a fallback.
	 *
	 * The delete button is always rendered alongside the configured mode
	 * buttons and is not affected by this property.
	 *
	 * Can be changed at runtime.
	 *
	 * @public
	 */
	@property({ type: Array })
	modes: Array<`${GeomapSelectionMode}`> = [];

	_validator: Validation = () => { return { valid: true, reason: undefined }; };

	async onEnterDOM() {
		this._instance = new GeomapSelectionControlWrapper({
			selectionType: this.selectionType,
			selectionFinishCallback: e => this.fireDecoratorEvent("selection-finish", e.detail),
			selectionItemCallback: e => this.fireDecoratorEvent("selection-item", e.detail),
		});

		await super.onEnterDOM();

		this._pushModes();

		this._instance._container.addEventListener("selection-mode-change", (e: Event) => {
			const detail = (e as CustomEvent<SelectionModeChangeEventDetail>).detail;
			this.selectionType = detail.selectionMode;
			e.stopPropagation();
		});
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		if (!this._instance || !this.map) {
			return;
		}

		if (changeInfo.type === "property" && changeInfo.name === "modes") {
			this._pushModes();
		}

		if (!this._checkEnabled()) {
			super.handleInvalidation(changeInfo);
			return;
		}

		const style = getSelectionStyles();
		this._instance._container.setModeStyles(this._instance._container.selectionType, style);
		this._instance._container?.updateAllSelectionStyles(style);

		if (changeInfo.type === "property" && changeInfo.name === "selectionType") {
			this._instance._container._terraDraw.setMode(this.selectionType);
		}

		super.handleInvalidation(changeInfo);
	}

	/**
	 * Forwards the current `modes` value to the inner container, validates
	 * the input, and keeps `selectionType` consistent with what's actually
	 * visible. Idempotent — safe to call from both `onEnterDOM` and
	 * `handleInvalidation`; no-op when the inner container is missing.
	 *
	 * @private
	 */
	_pushModes(): void {
		const container = this._instance?._container;
		if (!container) {
			return;
		}

		container.modes = this.modes;
		container._validateModes();

		const effective = container.effectiveModes;
		if (effective.length && !effective.includes(this.selectionType as `${GeomapSelectionMode}`)) {
			this.selectionType = effective[0];
		}
	}

	_checkEnabled(): boolean {
		if (!this._instance || !this._instance._container || !this._instance._container._checkEnabled()) {
			return false;
		}
		return true;
	}

	/**
	 * Changes styling of the selection control with given set of styles
	 *
	 * @param oStyles
	 * @public
	 */
	setModeStyles(oStyles: SelectionStylesConfigType): void {
		if (this._instance && this._instance._container) {
			this._instance._container.setModeStyles(this.selectionType, oStyles);
		}
	}

	get selections() {
		return this._instance?._container?.selections;
	}

	get isSelectionMapControl() {
		return true;
	}

	/**
	 * API for setting custom validator used during selection.
	 *
	 * @param fn
	 * @public
	 */
	setValidator(fn: Validation): void {
		this._validator = fn;
		this._instance?._container.setValidator(fn);
	}
}

GeomapSelectionControl.define();

export {
	SelectionFinishEventDetail,
	SelectionItemEventDetail,
};

export default GeomapSelectionControl;
