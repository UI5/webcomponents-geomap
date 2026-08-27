import type Map from "../extensions/Map.js";
import {
	TerraDraw,
	TerraDrawFreehandMode,
	TerraDrawRectangleMode,
	TerraDrawCircleMode,
	TerraDrawPolygonMode,
	TerraDrawLineStringMode,
	TerraDrawSelectMode,
	TerraDrawRenderMode,
	TerraDrawPointMode,
} from "terra-draw";
import { TerraDrawMapLibreGLAdapter } from "terra-draw-maplibre-gl-adapter";
import type { Validation } from "terra-draw/dist/common";

import { getSelectionStyles, getFullSelectionConfig } from "../config/Config.js";

interface IStringIndex {
	[key: string]: { styles: any }
}

/**
 * @class
 *
 * ### Overview
 *
 * The `GeomapDraw` creates an instance of TerraDraw.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/utils/GeomapDraw.js";`
 *
 * @constructor
 * @experimental
 * @private
 */
class GeomapDraw {
	draw: TerraDraw | null;
	_mParams: any;
	selectionType = "select";
	_validator: Validation = () => { return { valid: true, reason: undefined }; };

	constructor(map: Map, mParams: any) {
		this.draw = this.createInstance(map, mParams);
	}

	createInstance(map: Map, mParams: any) {
		this._mParams = mParams;
		const oStyles = getSelectionStyles();
		const oConfig = getFullSelectionConfig(oStyles);

		const draw = new TerraDraw({
			adapter: new TerraDrawMapLibreGLAdapter({ map }),
			modes: [
				// LineString Mode has the built-in name "linestring"
				new TerraDrawFreehandMode({ ...oConfig.selectionStyles.freehand, ...oConfig.selectionModes }),
				new TerraDrawRectangleMode({ ...oConfig.selectionStyles.rectangle, ...oConfig.selectionModes }),
				new TerraDrawCircleMode({ ...oConfig.selectionStyles.circle, ...oConfig.selectionModes }),
				new TerraDrawPolygonMode({ ...oConfig.selectionStyles.polygon, ...oConfig.selectionModes }),
				new TerraDrawLineStringMode({ ...oConfig.selectionStyles.linestring, ...oConfig.selectionModes }),
				new TerraDrawPointMode({ ...oConfig.selectionStyles.point, ...oConfig.selectionModes }),
				new TerraDrawSelectMode({ ...oConfig.selectionStyles.select, ...oConfig.selectionModes }),
				// Render Modes are given custom names
				new TerraDrawRenderMode({
					modeName: "ourmodename",
				}),
			],
		});
		draw.start();
		const oModeStyles = (oConfig.selectionStyles as IStringIndex)[this.selectionType];
		draw.setModeStyles(this.selectionType, oModeStyles.styles);

		return draw;
	}

	destroy() {
		this.draw = null;
	}
}

export default GeomapDraw;
