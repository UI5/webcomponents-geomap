import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import slot from "@ui5/webcomponents-base/dist/decorators/slot.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import GeomapLayerBase from "./GeomapLayerBase.js";
import type { PointLike, MapGeoJSONFeature } from "./MapLibre.js";

interface PropertyMetadata {
	[key: string]: any; // Define the structure of property metadata
}
/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-layer` defines the Layer webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapLayer.js";`
 * @constructor
 * @extends GeomapLayerBase
 * @public
 */
@customElement("ui5-geomap-layer")
class GeomapLayer extends GeomapLayerBase {
	/**
	* ID of a ui5-geomap-source element
	*
	* @default ""
	* @public
	*/
	@property({ type: String })
	source = "";

	/**
	* States
	*
	* @public
	*/
	@slot({ type: HTMLElement, invalidateOnChildChange: true, "default": true })
	states!: Array<HTMLElement>;

	/**
	* @override
	*/
	get layerSource() {
		const sourceElement: any = this.parentElement!.querySelector(`#${this.source}`);
		if (!sourceElement) {
			return "";
		}

		return sourceElement.effectiveId as string;
	}

	/**
	* Determines if a property is set, either directly on the layer, or via feature state
	* @param prop
	* @private
	*/
	_isPropertyValueSet(prop: keyof this): boolean {
		if (this[prop] !== undefined) {
			return true; // property set directly on the layer
		}

		if (this.states.length === 0) {
			return false; // property not set directly on the layer, and no states exist, so property is not set
		}

		return this.states.some((state: any) => state[prop] !== undefined && state[prop] !== ""); // if at least one layer sets the property, it is set
	}

	/**
	* @override
	*/
	_getPropertyValue(prop: keyof this, propData: PropertyMetadata) {
		const localValue: keyof this = super._getPropertyValue(prop, propData); // value of the property on layer level

		if (propData.noExpression) {
			return localValue;
		}

		if (!this._isPropertyValueSet(prop)) {
			return undefined;
		}

		if (this.states.length === 0) {
			return localValue;
		}

		const expr: Array<string> = ["case"];
		this.states.forEach((state: any) => {
			let stateValue = state[prop]; // value of the property on state level
			if (propData.formatter) {
				stateValue = propData.formatter(stateValue);
			}
			expr.push(["==", ["feature-state", "ui5-geomap-state"], state.name as string] as unknown as string, stateValue !== undefined && stateValue !== "" ? stateValue as string : localValue as string);
		});
		expr.push(this[prop] as string);
		return expr;
	}

	/**
	* Returns this layer's features, found at a point
	* @public
	* @param point
	*/
	getFeaturesAtPoint(point: PointLike): MapGeoJSONFeature[] | undefined {
		const features = this.map?.queryRenderedFeatures(point, {
			layers: [this._id],
		});

		return features;
	}
}

export { PointLike };
export default GeomapLayer;
