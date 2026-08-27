import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import EventProvider from "@ui5/webcomponents-base/dist/EventProvider.js";
import GeomapProviderBase from "./GeomapProviderBase.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";

interface RequestOtions {
	x?: string;
	y?: number;
	method: string
	url: string,
	headers?: {
		"Content-Type"?: string
		"Authorization"?: string
	},
	body?: string,
}

type StyleRasterSource = {
	version: string,
	sources: object;
	layers: object,
}

/**
 * @class
 *
  * ### Overview
 *
 * The `ui5-geomap-hss-provider` defines the HSS Provider webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapHssProvider.js";`
 *
 * @constructor
 * @extends GeomapProviderBase
 * @experimental
 * @public
 */
@customElement("ui5-geomap-hss-provider")
class GeomapHssProvider extends GeomapProviderBase {
	/**
	* Service URL - The address of the service.
	* @default ""
	* @public
	*/
	@property({ type: String })
	serviceUrl = "";

	/**
	* Service Authentication URL - The address of the service used to fetch JWT token.
	* @default ""
	* @public
	*/
	@property({ type: String })
	serviceAuthenticationUrl!: string

	/**
	* Client Id - The application ID that's assigned to your app.
	* @default ""
	* @public
	*/
	@property({ type: String })
	clientId!: string

	/**
	* Client Secret - The client secret that is generated for your app.
	* @default ""
	* @public
	*/
	@property({ type: String })
	clientSecret!: string

	/**
	* Style URL - URL of the style currently displayed in the receiver.
	* @default ""
	* @public
	*/
	@property({ type: String })
	styleUrl!: string

	eventProvider: EventProvider<GeomapHssProvider, GeomapHssProvider>;
	sToken: string;
	tokenValidUntil: Date;

	constructor() {
		super();
		this.sToken = "";
		this.tokenValidUntil = new Date();
		this.eventProvider = new EventProvider();
		this.attachInvalidate(this.handleInvalidation.bind(this));
	}

	detachChangeHandler(callback: () => GeomapHssProvider): void {
		this.eventProvider.detachEvent("update", callback);
	}

	async attachChangeHandler(callback: () => GeomapHssProvider): Promise<void> {
		this.eventProvider.attachEvent("update", callback);
		// check if token is expired
		if (!this.isTokenValid() && this.isValidConfiguration()) {
			await this._fetchToken();
		}
	}

	async onAfterRendering() {
		await this.whenMapConnected();
		this.eventProvider.fireEvent("update", this);
	}

	/**
	* Transforms request and adds authorization bearer to the request
	*
	* @override
	*/
	transformRequest(url: string) {
		if (this.sToken && url.includes(this.serviceUrl)) {
			return {
				url,
				method: "GET",
				headers: {
					"Accept": "*/*",
					"Authorization": `Bearer ${this.sToken}`,
				},
			};
		}
		return {
			url,
		};
	}

	/**
	* @override
	*/
	getStyle() {
		return this.isValidConfiguration() ? this.styleUrl : "" as string;
	}

	/**
	* This method requests new oAuth token
	*
	* @private
	* @override
	*/
	_fetchToken(): Promise<any> {
		if (!this.isValidConfiguration()) {
			return Promise.reject(new Error("Missing config or possible misconfiguration."));
		}
		const clientId: string = this.clientId,
			oParams = new URLSearchParams(),
			sEncoded = btoa(`${clientId}:${this.clientSecret}`),
			sAuth = `Basic ${sEncoded}`; // base64 encoded
		let oOptions: RequestOtions;

		return new Promise((resolve, reject) => {
			oParams.append("client_id", clientId);
			oParams.append("grant_type", "client_credentials");
			oOptions = {
				method: "POST",
				url: `${this.serviceAuthenticationUrl}/oauth/token`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": sAuth,
				},
				body: oParams.toString(),
			};

			fetch(oOptions.url, oOptions)
				.then(oResponse => { return Promise.all([oResponse.clone().json()]); })
				.then(([oResult]) => {
					if (oResult.access_token && oResult.token_type === "bearer") {
						this.sToken = oResult.access_token;
						this.tokenValidUntil = this.createTokenExpiryDate(oResult.expires_in - 10);
						resolve(oResult);
					} else {
						this.sToken = "";
						reject(new Error("Error fetching new token."));
					}
				})
				.catch(oException => {
					this.sToken = "";
					reject(new Error(`Exception parsing response ${oException.message}`));
				});
		});
	}

	/**
	* Calculates new token expiration date based on given input
	*
	*/
	createTokenExpiryDate(iSeconds: number) {
		const currentTimeMillis = new Date().getTime(),
			addedSecondsMillis = iSeconds * 1000;

		return new Date(currentTimeMillis + addedSecondsMillis);
	}

	/**
	* Compares current and token validity
	*
	*/
	isTokenValid() {
		const oCurrentDate = new Date(),
			bResult = oCurrentDate < this.tokenValidUntil;
		return bResult;
	}

	/**
	* Return if the provided configuration is valid
	*
	* @override
	*/
	isValidConfiguration(): boolean {
		let isValid: boolean = false;

		const bStyleValid = this.styleUrl === "" || this.isValidStyleUrl(this.styleUrl);
		if (this.clientId && this.clientSecret && this.isValidHttpUrl(this.serviceUrl) && this.isValidHttpUrl(this.serviceAuthenticationUrl) && bStyleValid) {
			isValid = true;
		}

		return isValid;
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		if (changeInfo.type === "property") {
			this._fetchToken();
		}
	}

	isValidStyleUrl(styleUrl: string | StyleRasterSource): boolean {
		let bValid = false;

		if (styleUrl && typeof styleUrl === "string") {
			bValid = this.isValidHttpUrl(styleUrl);
		} else if (typeof styleUrl === "object") {
			if (styleUrl.version && styleUrl.sources && styleUrl.layers) {
				bValid = true;
			}
		}

		return bValid;
	}
}

GeomapHssProvider.define();

export default GeomapHssProvider;
