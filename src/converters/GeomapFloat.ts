import type { Property } from "@ui5/webcomponents-base/dist/UI5ElementMetadata.js";

const SAPGeomapFloat = {
	toAttribute(propertyValue: number | Array<any> | undefined | null) {
		if (propertyValue === null || propertyValue === undefined) {
			return null;
		}
		if (Array.isArray(propertyValue)) {
			return JSON.stringify(propertyValue);
		}

		return `${propertyValue}`;
	},
	fromAttribute(attributeValue: string | null): number | Array<any> | null {
		let propertyValue: number | Array<any>;
		try {
			propertyValue = JSON.parse(attributeValue as string);
		} catch (e) {
			propertyValue = parseFloat(attributeValue as string); // zTODO what to do if null is passed
		}
		return propertyValue;
	},
} as Property["converter"];

export default SAPGeomapFloat;
