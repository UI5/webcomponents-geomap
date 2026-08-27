import type { Property } from "@ui5/webcomponents-base/dist/UI5ElementMetadata.js";

type GeomapProperty = Property & {
	paint?: string;
	layout?: string;
	noExpression?: boolean;
	formatter?: (value: boolean) => string;
}
export default GeomapProperty;
