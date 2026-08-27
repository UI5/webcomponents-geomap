import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type GeomapProperty from "../types/GeomapPropertyType.js";
/**
 * Returns an extended property decorator.
 *
 * @param { GeomapProperty } propData
 * @returns { PropertyDecorator }
 */
const geomapProperty = (propData?: GeomapProperty): PropertyDecorator => {
	return property(propData);
};
export default geomapProperty;
