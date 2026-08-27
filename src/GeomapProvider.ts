import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import EventProvider from "@ui5/webcomponents-base/dist/EventProvider.js";
import GeomapProviderBase from "./GeomapProviderBase.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-provider` defines the Provider webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";`
 *
 * @constructor
 * @extends GeomapProviderBase
 * @experimental
 * @public
 */
@customElement("ui5-geomap-provider")

class GeomapProvider extends GeomapProviderBase {
	/**
	* Style URL - containing url to the provider resources for style. Should contain API key if such is required.
	* @default ""
	* @public
	*/
	@property({ type: String })
	styleUrl = "";

	eventProvider: EventProvider<GeomapProvider, GeomapProvider>;

	constructor() {
		super();
		this.eventProvider = new EventProvider<GeomapProvider, GeomapProvider>();
		this.attachInvalidate(this.handleInvalidation.bind(this));
	}

	detachChangeHandler(callback: () => GeomapProvider): void {
		this.eventProvider.detachEvent("update", callback);
	}

	attachChangeHandler(callback: () => GeomapProvider): void {
		this.eventProvider.attachEvent("update", callback);
	}

	onAfterRendering() {
		this.eventProvider.fireEvent("update", this);
	}

	/**
	* @override
	*/
	getStyle():string {
		return this.styleUrl;
	}

	/**
	* Transforms request and adds authorization bearer to the request
	*
	* @override
	*/
	transformRequest(url: string):any {
		return {
			url,
		};
	}

	/**
	* Return if the provided configuration is valid
	*
	* @override
	*/
	isValidConfiguration(): boolean {
		let isValid: boolean = false;

		if (this.styleUrl && this.isValidHttpUrl(this.styleUrl)) {
			isValid = true;
		}

		return isValid;
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		if (changeInfo.type === "property") {
			this._fetchToken();
		}
	}
}

GeomapProvider.define();

export default GeomapProvider;
