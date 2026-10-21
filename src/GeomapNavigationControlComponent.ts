import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import jsxRenderer from "@ui5/webcomponents-base/dist/renderer/JsxRenderer.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import event from "@ui5/webcomponents-base/dist/decorators/event-strict.js";
import GeomapNavigationControlComponentTemplate from "./GeomapNavigationControlComponentTemplate.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/less.js";
import "@ui5/webcomponents-icons/dist/expand.js";
import styles from "./generated/themes/GeomapNavigationControlComponent.css.js";
/**
 * @class
 *
 * <h3 class="comment-api-title">Overview</h3>
 *
 * <h3>Usage</h3>
 *
 * <h3>CSS Shadow Parts</h3>
 *
 * <h3>ES6 Module Import</h3>
 *
 * @constructor
 * @extends UI5Element
 * @public
 */
@customElement({
	tag: "ui5-geomap-navigation-control-component",
	renderer: jsxRenderer,
	template: GeomapNavigationControlComponentTemplate,
	styles: [styles],
})

/**
 * Fired when zoom in button is clicked.
 *
 * @public
 */
@event("zoom-in")

/**
 * Fired when zoom out button is clicked.
 * @public
 */
@event("zoom-out")

/**
 * Fired when compass button is clicked.
 * @public
 */
@event("compass-click")
class GeomapNavigationControlComponent extends UI5Element {
	eventDetails!: {
		"zoom-in": void;
		"zoom-out": void;
		"compass-click": void;
	}
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

	_onZoomIn() {
		this.fireDecoratorEvent("zoom-in");
	}
	_onZoomOut() {
		this.fireDecoratorEvent("zoom-out");
	}
	_onCompassClick() {
		this.fireDecoratorEvent("compass-click");
	}
	_setCSSParams(rotate: string) {
		this.style.setProperty("--transform-var", rotate);
	}
}

GeomapNavigationControlComponent.define();

export default GeomapNavigationControlComponent;
