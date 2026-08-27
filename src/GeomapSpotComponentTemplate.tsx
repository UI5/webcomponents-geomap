import Icon from "@ui5/webcomponents/dist/Icon.js";
import type GeomapSpotComponent from "./GeomapSpotComponent.js";

export default function GeomapSpotComponentTemplate(this: GeomapSpotComponent) {
	return <Icon name={this.icon} style={{
		width: this.width, height: this.height, cursor: "pointer", opacity: this.opacity, color: this.color
	}}></Icon>;
}
