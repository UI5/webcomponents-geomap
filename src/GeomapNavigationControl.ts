import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import GeomapControlBase from "./GeomapControlBase.js";
import GeomapNavigationControlWrapper from "./extensions/controls/GeomapNavigationControlWrapper.js";

/**
 * @class
 *
* ### Overview
 *
 * The `ui5-geomap-navigation-control` defines the Navigation webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";`
 *
 * @constructor
 * @extends GeomapControlBase
 * @experimental
 * @public
 */
@customElement({
	tag: "ui5-geomap-navigation-control",
})
class GeomapNavigationControl extends GeomapControlBase<GeomapNavigationControlWrapper> {
	/**
	* Defines whether the zoom control is visible.
	*
	* @default false
	* @public
	*/
	@property({ type: Boolean })
	noZoom = false;

	/**
	* Defines whether the compass control is visible.
	*
	* @default false
	* @public
	*/
	@property({ type: Boolean })
	noCompass = false;

	async onEnterDOM() {
		this._instance = new GeomapNavigationControlWrapper({
			noCompass: this.noCompass,
			noZoom: this.noZoom,
			visualizePitch: true,
		});

		await super.onEnterDOM();
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		super.handleInvalidation(changeInfo);

		if (!this._instance || !this.map) {
			return;
		}

		if (changeInfo.type === "property") {
			const name = changeInfo.name;

			if (name === "noZoom") {
				this._instance.setNoZoom(this.noZoom);
			}

			if (name === "noCompass") {
				this._instance.setNoCompass(this.noCompass);
			}
		}
	}
}

GeomapNavigationControl.define();

export default GeomapNavigationControl;
