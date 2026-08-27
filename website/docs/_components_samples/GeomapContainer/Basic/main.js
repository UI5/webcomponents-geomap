import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapContainer.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircle.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/List.js";

import "@ui5/webcomponents-icons/dist/map.js";
import "@ui5/webcomponents-icons/dist/map-fill.js";

const map = document.getElementById("map");

map.addEventListener("map-click", event => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);

	if (document.getElementById("markers1").checked) {
		const marker = document.createElement("ui5-geomap-spot");
		marker.lng = event.detail.lng;
		marker.lat = event.detail.lat;
		map.appendChild(marker);
	}
});

map.addEventListener("map-contextmenu", event => {
	console.log(`Map right-clicked at ${event.detail.lng}, ${event.detail.lat}`);

	const container = document.createElement("ui5-geomap-container");
	container.lng = event.detail.lng;
	container.lat = event.detail.lat;
	container.innerHTML = `<div class="opens-popup" style="background: white; width: 0px; height: 0px; cursor: pointer"></div>`;
	map.appendChild(container);

	container.addEventListener("click", event => {
		setTimeout(() => {
			document.getElementById("info").opener = container;
			document.getElementById("info").open = true;
			event.stopPropagation();
		});
	});
	container.click();
});

map.addEventListener("map-error", event => {
	console.log(`Map error: ${event.detail.error}`);
});

[...document.querySelectorAll(".opens-popup")].forEach(el => {
	el.addEventListener("click", event => {
		document.getElementById("info").opener = el;
		document.getElementById("info").open = true;
		event.stopPropagation();
	});
});

[...document.querySelectorAll(".clickable-layer")].forEach(el => {
	el.addEventListener("layer-click", event => {
		console.log(`Layer clicked at ${event.detail.lng}, ${event.detail.lat} / ${event.detail.x}px, ${event.detail.y}px`);
		document.getElementById("info").opener = event.detail.dom;
		document.getElementById("info").open = true;
	});
});
