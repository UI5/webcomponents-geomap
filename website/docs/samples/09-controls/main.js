import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapScaleControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapFullscreenControl.js";

import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Label.js";

const map = document.getElementById("map");

map.addEventListener("map-click", event => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);
});
