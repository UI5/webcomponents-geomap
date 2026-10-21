import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import GeomapControlBase from "./GeomapControlBase.js";
import GeomapFullscreenControlWrapper from "./extensions/controls/GeomapFullscreenControlWrapper.js";

/**
 * @class
 *
* ### Overview
 *
 * The `ui5-geomap-fullscreen-control` defines the Fullscreen webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapFullscreenControl.js";`
 *
 * @constructor
 * @extends GeomapControlBase
 * @public
 */
@customElement("ui5-geomap-fullscreen-control")

class GeomapFullscreenControl extends GeomapControlBase<GeomapFullscreenControlWrapper> {
	async onEnterDOM() {
		this._instance = new GeomapFullscreenControlWrapper({
			container: this.parentElement!,
		});

		await super.onEnterDOM();
	}
}

GeomapFullscreenControl.define();

export default GeomapFullscreenControl;
