import type { Property } from "@ui5/webcomponents-base/dist/UI5ElementMetadata.js";

const SAPGeomapString = {
	toAttribute(propertyValue: string | Array<any>) {
		if (propertyValue === null || propertyValue === undefined) {
			return propertyValue;
		}

		if (Array.isArray(propertyValue)) {
			return JSON.stringify(propertyValue);
		}

		return propertyValue;
	},
	fromAttribute(attributeValue: string | null): string | Array<any> | null {
		let propertyValue: string | Array<any> | null;
		try {
			propertyValue = JSON.parse(attributeValue as string);
		} catch (e) {
			propertyValue = attributeValue;
		}
		return propertyValue;
	},
} as Property["converter"];

export default SAPGeomapString;
