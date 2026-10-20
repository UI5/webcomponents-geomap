import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import slot from "@ui5/webcomponents-base/dist/decorators/slot.js";
import jsxRenderer from "@ui5/webcomponents-base/dist/renderer/JsxRenderer.js";
import type { InvalidationInfo } from "@ui5/webcomponents-base/dist/UI5Element.js";
import GeomapControlBase from "./GeomapControlBase.js";
import GeomapContainerControlWrapper from "./extensions/controls/GeomapContainerControlWrapper.js";
import GeomapContainerControlTemplate from "./GeomapContainerControlTemplate.js";

/**
 * @class
 *
 * ### Overview
 *
 * The `ui5-geomap-container-control` defines a reusable container webcomponent that can hold custom HTML content
 * and be positioned on the sides of the map.
 *
 * ### ES6 Module Import
 *
 * `import "@ui5/webcomponents-geomap/dist/GeomapContainerControl.js";`
 *
 * @constructor
 * @extends GeomapControlBase
 * @public
 */
@customElement({
	tag: "ui5-geomap-container-control",
	template: GeomapContainerControlTemplate,
	renderer: jsxRenderer,
})
class GeomapContainerControl extends GeomapControlBase<GeomapContainerControlWrapper> {
	/**
	 * Describes the content of the container control.
	 *
	 * @public
	 */
	@slot({ type: HTMLElement, "default": true })
	content!: Array<HTMLElement>;

	async onEnterDOM() {
		this._instance = new GeomapContainerControlWrapper({
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
			this._instance.setSlotName(this._individualSlot);
		}
	}
}

GeomapContainerControl.define();

export default GeomapContainerControl;
