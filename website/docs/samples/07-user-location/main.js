import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";

import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Toast.js";

const map = document.getElementById("map");

window.onload = function () {
	const success = position => {
		const lng = position.coords.longitude;
		const lat = position.coords.latitude;

		const container = document.createElement("ui5-geomap-container");
		container.lng = lng;
		container.lat = lat;
		const strip = document.createElement("ui5-messagestrip");
		strip.type = "Positive";
		strip.textContent = "You are here";
		container.appendChild(strip);
		strip.addEventListener("close", () => {
			map.removeChild(container);
			setTimeout(() => {
				map.flyTo(0, 0, 1);
			});
		});
		map.appendChild(container);

		setTimeout(() => {
			map.flyTo(lng, lat, 15);
		});
	};

	const error = () => {
		document.getElementById("toast").show();
	};
	navigator.geolocation.getCurrentPosition(success, error);
};
