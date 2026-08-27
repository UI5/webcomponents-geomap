import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapSpot.js";
import "@ui5/webcomponents-geomap/dist/GeomapSpotComponent.js";
import "@ui5/webcomponents-geomap/dist/GeomapContainer.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents/dist/Text.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/Menu.js";
import "@ui5/webcomponents-icons/dist/map-fill.js";

const map = document.getElementById("myMap");

const spot = document.getElementById("spot");
spot.addEventListener("click", event => {
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
spot.addEventListener("right-click", event => {
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

[...document.querySelectorAll(".opens-popup")].forEach(el => {
	el.addEventListener("click", event => {
		document.getElementById("info").opener = el;
		document.getElementById("info").open = true;
		event.stopPropagation();
	});
});
