import Button from "@ui5/webcomponents/dist/Button.js";
import type GeomapNavigationControlComponent from "./GeomapNavigationControlComponent.js";

import "@ui5/webcomponents-icons-business-suite/dist/map-navigation.js";

export default function GeomapNavigationControlComponentTemplate(this: GeomapNavigationControlComponent) {
	return <div class="ui5-geomap-navigation-control-component">
		{!this.noZoom &&
			<>
				<Button icon="sap-icon://add" accessible-name="Zoom in" tooltip="Zoom in" onClick={this._onZoomIn}></Button>
				<Button icon="sap-icon://less" accessible-name="Zoom out" tooltip="Zoom out" onClick={this._onZoomOut}></Button>
			</>
		}

		{!this.noCompass &&
			<Button class="compass" accessible-name="Reset bearing to north" tooltip="Reset bearing to north" icon="business-suite/map-navigation" onClick={this._onCompassClick}></Button>
		}
	</div>;
}
