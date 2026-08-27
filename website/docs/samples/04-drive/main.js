import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapPolygon.js";
import "@ui5/webcomponents-geomap/dist/GeomapLine.js";
import "@ui5/webcomponents-geomap/dist/GeomapPoint.js";
import "@ui5/webcomponents-geomap/dist/GeomapSpot.js";
import "@ui5/webcomponents-geomap/dist/GeomapContainer.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircle.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/StepInput.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/MessageStrip.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/Toast.js";

import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/map.js";
import "@ui5/webcomponents-icons/dist/map-fill.js";

const map = document.getElementById("map");
const route = document.getElementById("route");
const routeTravelled = document.getElementById("routeTravelled");
const car = document.getElementById("car");
const speedInput = document.getElementById("speed");
const start = document.getElementById("startAnimation");
const display = document.getElementById("display");
const displayTime = document.getElementById("displayTime");

map.addEventListener("map-click", event => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);
});

start.addEventListener("click", () => {
	start.disabled = true;

	const speed = parseFloat(speedInput.value);
	const totalDistance = route.getDistance("kilometers");
	const totalTime = totalDistance / speed;

	const updateInterval = 4; // seconds
	let distanceTravelled = 0;
	let timeTravelled = 0;
	let frame = null;

	[...routeTravelled.children].forEach(child => {
		routeTravelled.removeChild(child);
	});

	if (frame) {
		cancelAnimationFrame(frame);
	}

	const animate = () => {
		distanceTravelled += (updateInterval / 3600) * speed;
		if (distanceTravelled > totalDistance) {
			distanceTravelled = totalDistance;
		}
		timeTravelled = distanceTravelled / speed;

		display.value = `${distanceTravelled.toPrecision(
			2,
		)} / ${totalDistance.toPrecision(2)} km`;
		displayTime.value = `${Math.round(timeTravelled * 60)} / ${Math.round(
			totalTime * 60,
		)} min`;
		const coords = route.getPointAt(distanceTravelled, "kilometers");

		car.lng = coords.lng;
		car.lat = coords.lat;

		const point = document.createElement("ui5-geomap-point");
		point.lng = coords.lng;
		point.lat = coords.lat;
		routeTravelled.appendChild(point);

		if (distanceTravelled < totalDistance) {
			frame = requestAnimationFrame(animate);
		} else {
			start.disabled = false;
			document.getElementById("toast").open = true;
		}
	};
	animate();
});

const info = document.getElementById("info");
const destination = document.getElementById("destination");

destination.addEventListener("click", () => {
	info.opener = destination;
	info.open = true;
});

document
	.querySelector("#info ui5-messagestrip")
	.addEventListener("close", () => {
		info.open = false;
	});
