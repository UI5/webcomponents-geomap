import customElement from "@ui5/webcomponents-base/dist/decorators/customElement.js";
import property from "@ui5/webcomponents-base/dist/decorators/property.js";
import jsxRenderer from "@ui5/webcomponents-base/dist/renderer/JsxRenderer.js";
import UI5Element from "@ui5/webcomponents-base/dist/UI5Element.js";
import GeomapSpotComponentTemplate from "./GeomapSpotComponentTemplate.js";
import "@ui5/webcomponents-icons/dist/map.js";

/**
 * @class
 *
 * <h3 class="comment-api-title">Overview</h3>
 *
 *
 * <h3>Usage</h3>
 *
 * <h3>CSS Shadow Parts</h3>
 *
 * <h3>ES6 Module Import</h3>
 *
 * @constructor
 * @extends UI5Element
 * @experimental
 * @public
 */
@customElement({
	tag: "ui5-geomap-spot-component",
	renderer: jsxRenderer,
	template: GeomapSpotComponentTemplate,
})

class GeomapSpotComponent extends UI5Element {
	/**
	 * Icon to be displayed as a spot.
	 * @default "map"
	 * @public
	 */
	@property({ type: String })
	icon = "map";

	/**
	 * Width of the spot displayed.
	 * @default "2rem"
	 * @public
	 */
	@property({ type: String })
	width = "2rem";

	/**
	 * Height of the spot displayed.
	 * @default "2rem"
	 * @public
	 */
	@property({ type: String })
	height = "2rem";

	/**
	 * Opacity of the spot displayed.
	 * @default "1"
	 * @public
	 */
	@property({ type: String })
	opacity = "1";

	/**
	 * Color of the spot displayed.
	 * @default ""
	 * @public
	 */
	@property({ type: String })
	color = "";

	/**
	 * Longitude of the spot displayed.
	 * @default 0
	 * @public
	 */
	@property({ type: Number })
	lng = 0;

	/**
	 * Latitude of the spot displayed.
	 * @default 0
	 * @public
	 */
	@property({ type: Number })
	lat = 0;
}

GeomapSpotComponent.define();

export default GeomapSpotComponent;
