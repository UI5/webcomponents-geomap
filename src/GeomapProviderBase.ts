import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import GeomapElement from "./GeomapElement.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-provider-base` defines the Provider Base webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapProviderBase.js";`
 *
 * @constructor
 * @extends GeomapElement
 * @experimental
 * @public
 */
@customElement("ui5-geomap-provider-base")
class GeomapProviderBase extends GeomapElement {
	sToken: string
	styleUrl: string
	clientId: string
	clientSecret: string

	constructor() {
		super();
		this.sToken = "";
		this.styleUrl = "";
		this.clientId = "";
		this.clientSecret = "";
	}

	transformRequest(url: string) {
		return {
			url,
		};
	}

	isValidConfiguration(): boolean {
		return false;
	}

	getStyle() {}

	_fetchToken() { return Promise.resolve("not implemented"); }

	isValidHttpUrl(stringUrl: string): boolean {
		try {
		  const newUrl = new URL(stringUrl);
		  return newUrl.protocol === "http:" || newUrl.protocol === "https:";
		} catch (err) {
		  return false;
		}
	}
}
GeomapProviderBase.define();

export default GeomapProviderBase;
