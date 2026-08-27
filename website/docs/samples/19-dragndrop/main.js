import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapScaleControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapFullscreenControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapSelectionControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapCopyrightControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapContainer.js";
import "@ui5/webcomponents-geomap/dist/GeomapSpot.js";
import "@ui5/webcomponents-geomap/dist/GeomapGeocircle.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircle.js";
import "@ui5/webcomponents-geomap/dist/GeomapLine.js";
import "@ui5/webcomponents-geomap/dist/GeomapPolygon.js";
import "@ui5/webcomponents-geomap/dist/GeomapPoint.js";
import "@ui5/webcomponents/dist/Menu.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Link.js";
import "@ui5/webcomponents-icons/dist/message-information.js";
import { setSelectionStyles, setLongLatPrecision } from "@ui5/webcomponents-geomap/dist/config/Config.js";

// set custom selection styles
setSelectionStyles({
	fillColor: "7FFFD4",
	fillOpacity: 0.7,
	outlineColor: "0000FF",
	outlineWidth: 2,
	width: 50,
	dragndropHover: "FF0000",
});

setLongLatPrecision(5);

const map = document.getElementById("map");

map.addEventListener("map-click", event => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);
});

map.addEventListener("selection-finish", event => {
	if (event.detail) {
		console.log("selection-finish", event.detail);
	}
});

map.addEventListener("selection-item", evt => {
	console.log(evt.detail);
});

map.addEventListener("polygon-dragndrop-end", evt => {
	console.log("polygon moved:", evt.detail);
});

map.addEventListener("circle-dragndrop-end", evt => {
	console.log("circle moved:", evt.detail);
});

map.addEventListener("geocircle-dragndrop-end", evt => {
	console.log("geocircle moved:", evt.detail);
});

map.addEventListener("line-dragndrop-end", evt => {
	console.log("line moved:", evt.detail);
});

map.addEventListener("map-error", event => {
	console.log(`Map error: ${event.detail.error}`);
});

const spot3 = document.getElementById("spot3");
spot3.addEventListener("click", event => {
	const container = document.createElement("ui5-geomap-container");
	container.lng = event.target.lng;
	container.lat = event.target.lat;
	container.innerHTML = `<div class="opens-popup" style="background: white; width: 0px; height: 0px; cursor: pointer"></div>`;
	map.appendChild(container);

	container.addEventListener("click", event => {
		setTimeout(() => {
			const info = document.getElementById("spotInfo");
			info.querySelector("#spotId").innerText = "Spot 3";
			info.querySelector("#spotLng").innerText = event.target.lng;
			info.querySelector("#spotLat").innerText = event.target.lat;
			info.opener = container;
			info.open = true;
			event.stopPropagation();
		});
	});
	container.click();
});
spot3.addEventListener("right-click", event => {
	const container = document.createElement("ui5-geomap-container");
	container.id = "menuContainer";
	container.lng = event.target.lng;
	container.lat = event.target.lat;
	map.appendChild(container);

	container.addEventListener("click", event => {
		setTimeout(() => {
			const menu = document.getElementById("menuBasic");
			menu.opener = container;
			menu.open = true;
			event.stopPropagation();
		});
	});
	container.click();
});
