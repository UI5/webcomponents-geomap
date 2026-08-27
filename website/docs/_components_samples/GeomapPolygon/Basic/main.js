import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapPolygon.js";
import "@ui5/webcomponents-geomap/dist/GeomapPoint.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/List.js";

[...document.querySelectorAll(".clickable-layer")].forEach(el => {
	el.addEventListener("layer-click", event => {
		console.log(`Layer clicked at ${event.detail.lng}, ${event.detail.lat} / ${event.detail.x}px, ${event.detail.y}px`);
		document.getElementById("info").opener = event.detail.dom;
		document.getElementById("info").open = true;
	});
});
