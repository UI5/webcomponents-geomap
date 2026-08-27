import { reRenderAllUI5Elements } from "@ui5/webcomponents-base/dist/Render.js";
import { isBooted } from "@ui5/webcomponents-base/dist/Boot.js";
import type { HexColorStyling, Validation } from "terra-draw/dist/common";
import type SelectionStylesConfigType from "../types/GeomapSelectionType.js";

const _validator: Validation = () => { return { valid: true, reason: undefined }; };
const DEFAULT_LONGLATPRECISION: number = 5;
const DEFAULT_STYLES: SelectionStylesConfigType = {
	fillColor: "#0000FF",
	fillOpacity: 0.5,
	outlineColor: "#FF0000",
	outlineWidth: 2,
	width: 2,
	dragndropHover: "#3bb2d0",
	bounceColor: "#0096FF"
};
const DEFAULT_WORKER_PATH = "worker.js";
const DEFAULT_CLICK_DELAY: number = 300;

/**
 * Returns the full configuration for selection.
 * @param conf
 * @private
 */
const getFullSelectionConfig = (conf: SelectionStylesConfigType) => {
	return {
		selectionStyles: {
			"polygon": {
				styles: {
					fillColor: `${conf.fillColor}` as HexColorStyling,
					fillOpacity: conf.fillOpacity,
					outlineColor: `#${conf.outlineColor}` as HexColorStyling,
					outlineWidth: conf.outlineWidth,
				},
			},
			"point": {
				styles: {
					pointOutlineColor: `${conf.outlineColor}` as HexColorStyling,
					pointOutlineWidth: conf.outlineWidth,
					pointColor: `${conf.fillColor}` as HexColorStyling,
					pointWidth: conf.width,
				},
			},
			"linestring": {
				styles: {
					lineStringColor: `${conf.fillColor}` as HexColorStyling,
					lineStringWidth: conf.width,
				},
			},
			"freehand": {
				styles: {
					fillColor: `${conf.fillColor}` as HexColorStyling,
					fillOpacity: conf.fillOpacity,
					outlineColor: `${conf.outlineColor}` as HexColorStyling,
					outlineWidth: conf.outlineWidth,
				},
			},
			"circle": {
				styles: {
					fillColor: `${conf.fillColor}` as HexColorStyling,
					fillOpacity: conf.fillOpacity,
					outlineColor: `${conf.outlineColor}` as HexColorStyling,
					outlineWidth: conf.outlineWidth,
				},
			},
			"rectangle": {
				styles: {
					fillColor: `${conf.fillColor}` as HexColorStyling,
					fillOpacity: conf.fillOpacity,
					outlineColor: `${conf.outlineColor}` as HexColorStyling,
					outlineWidth: conf.outlineWidth,
				},
			},
			"select": {
				styles: {
					selectedPolygonColor: `${conf.fillColor}` as HexColorStyling,
					selectedPolygonFillOpacity: conf.fillOpacity,
					selectedPolygonOutlineColor: `${conf.outlineColor}` as HexColorStyling,
					selectedPolygonOutlineWidth: conf.outlineWidth,
					selectedPointWidth: conf.width,
					selectedLineStringWidth: conf.width,
					selectedLineStringColor: `${conf.fillColor}` as HexColorStyling,
					// ztodo: add the rest stuff
				},
			},
		},
		selectionModes: {
			validation: (...args: Parameters<Validation>) => {
				return _validator(...args);
			},
			flags: {
				polygon: {
					feature: {
						draggable: true,
						coordinates: {
							midpoints: true,
							draggable: true,
							resizeable: "center",
							deletable: true,
						},
					},
				},
				rectangle: {
					feature: {
						draggable: true,
						coordinates: {
							midpoints: true,
							draggable: true,
							resizeable: "center",
							deletable: true,
						},
					},
				},
				point: {
					feature: {
						draggable: true,
					},
				},
				freehand: {
					feature: {
						draggable: true,
						coordinates: {
							midpoints: true,
							draggable: true,
							deletable: true,
							validation: _validator,
						},
					},
				},
				circle: {
					feature: {
						draggable: true,
						coordinates: {
							midpoints: false,
							draggable: false,
							deletable: true,
							validation: _validator,
							resizable: "center-fixed", // can also be 'opposite', 'center', 'opposite-fixed'
						},
					},
				},
				linestring: {
					feature: {
						draggable: true,
						coordinates: {
							draggable: true,
							deletable: true,
							midpoints: {
								// Midpoint be dragged
								draggable: true,
							},
						},
					},
				},
			},
		},
	};
};
let curConfig: SelectionStylesConfigType | undefined;
let curPrecision: number | undefined;
let curWorkerPath: string | undefined;
let curClickDelay: number | undefined;

/**
 * Returns the currently configured selection, or the default ones as a fallback.
 * @public
 * @returns {object}
 */
const getSelectionStyles = (): SelectionStylesConfigType => {
	if (curConfig === undefined) {
		curConfig = getDefaultSelectionStyles();
	}
	return curConfig;
};

/**
 * Changes the current selection config, re-fetches all message bundles, updates all language-aware components
 * and returns a promise that resolves when all rendering is done.
 *
 * @param {object} config
 * @param {string|undefined} tag
 * @public
 * @returns {Promise<void>}
 */
const setSelectionStyles = async (config: SelectionStylesConfigType, tag?: string): Promise<void> => {
	// deep equal for objects
	if (JSON.stringify(curConfig) === JSON.stringify(config)) {
		return;
	}

	curConfig = config;

	if (isBooted() && tag) {
		await reRenderAllUI5Elements({ tag });
	}
};

/**
 * Returns the default configurations for selection.
 *
 * Note: Default configurations might be different from the configured one.
 *
 * @public
 * @returns {object}
 */
const getDefaultSelectionStyles = (): SelectionStylesConfigType => {
	return DEFAULT_STYLES;
};

/**
 * Returns the default precision for geometry.
 *
 * Note: Default configurations might be different from the configured one.
 *
 * @public
 * @returns {number}
 */
const getDefaultLongLatPrecision = (): number => {
	return DEFAULT_LONGLATPRECISION;
};

/**
 * Returns the default worker path for maplibre
 *
 * Note: Default configurations might be different from the configured one.
 *
 * @public
 * @returns {string}
 */
const getDefaultWorkerPath = (): string => {
	return DEFAULT_WORKER_PATH;
};

/**
 * Returns the currently configured precision used as part of the geometry, or the default ones as a fallback.
 * @public
 * @returns {number}
 */
const getLongLatPrecision = (): number => {
	if (curPrecision === undefined) {
		curPrecision = getDefaultLongLatPrecision();
	}
	return curPrecision;
};

/**
 * Changes the current precision config and returns a promise that resolves when all rendering is done.
 *
 * @param {number} precision
 * @public
 * @returns {Promise<void>}
 */
const setLongLatPrecision = async (precision: number): Promise<void> => {
	if (curPrecision === precision) {
		return;
	}

	curPrecision = precision;

	if (isBooted()) {
		await reRenderAllUI5Elements({ languageAware: true });
	}
};

/**
 * Returns the currently configured worker path used as for maplibre, or the default ones as a fallback.
 * @public
 * @returns {string}
 */
const getWorkerPath = (): string => {
	if (curWorkerPath === undefined) {
		curWorkerPath = getDefaultWorkerPath();
	}
	return curWorkerPath;
};

/**
 * Changes the current worker path config and returns a promise that resolves when all rendering is done.
 *
 * @param {string} workerPath
 * @public
 * @returns {Promise<void>}
 */
const setWorkerPath = async (workerPath: string): Promise<void> => {
	if (curWorkerPath === workerPath) {
		return;
	}

	curWorkerPath = workerPath;

	if (isBooted()) {
		await reRenderAllUI5Elements({ languageAware: true });
	}
};

/**
 * Returns the currently configured click delay used to discriminate single-click from double-click,
 * or the default as a fallback.
 * @public
 * @returns {number}
 */
const getClickDelay = (): number => {
	if (curClickDelay === undefined) {
		curClickDelay = DEFAULT_CLICK_DELAY;
	}
	return curClickDelay;
};

/**
 * Changes the click delay (in ms) used to discriminate single-click from double-click.
 * Should match or exceed the OS-configured double-click speed for accessibility.
 *
 * @param {number} delay
 * @public
 * @returns {void}
 */
const setClickDelay = (delay: number): void => {
	if (curClickDelay === delay) {
		return;
	}

	curClickDelay = delay;
};

export {
	getSelectionStyles,
	setSelectionStyles,
	getLongLatPrecision,
	setLongLatPrecision,
	getWorkerPath,
	setWorkerPath,
	getDefaultSelectionStyles,
	getFullSelectionConfig,
	getClickDelay,
	setClickDelay,
};
