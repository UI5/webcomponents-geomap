import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import slot from "@ui5/webcomponents-base/dist/decorators/slot.js";
import jsxRenderer from "@ui5/webcomponents-base/dist/renderer/JsxRenderer.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import GeomapControlBase from "./GeomapControlBase.js";
import GeomapCopyrightControlWrapper from "./extensions/controls/GeomapCopyrightControlWrapper.js";
import GeomapCopyrightControlTemplate from "./GeomapCopyrightControlTemplate.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-copyright-control` defines the copyright webcomponent.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapCopyrightControl.js";`
 *
 * @constructor
 * @extends GeomapControlBase
 * @public
 */
@customElement({
	tag: "ui5-geomap-copyright-control",
	template: GeomapCopyrightControlTemplate,
	renderer: jsxRenderer,
})
class GeomapCopyrightControl extends GeomapControlBase<GeomapCopyrightControlWrapper> {
	/**
	* Describes the content of the copyright control.
	*
	* @public
	*/
	@slot({ type: HTMLElement, "default": true })
	content!: Array<HTMLElement>;

	async onEnterDOM() {
		this._instance = new GeomapCopyrightControlWrapper({
			slotName: this._individualSlot ?? "",
		});
		await super.onEnterDOM();
	}

	handleInvalidation(changeInfo: InvalidationInfo) {
		super.handleInvalidation(changeInfo);

		if (!this._instance || !this.map) {
			return;
		}

		if (changeInfo.type === "slot" && this._individualSlot) {
			this._instance.setSlotName(this._individualSlot); // zTODO: check why this._individualSlot is 'any'
		}
	}
}

GeomapCopyrightControl.define();

export default GeomapCopyrightControl;
