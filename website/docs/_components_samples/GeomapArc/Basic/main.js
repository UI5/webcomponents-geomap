import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapContainer.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircle.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapArc.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents-icons/dist/flight.js";

const map = document.getElementById("map");
const arc = document.getElementById("arc");
const plane = document.getElementById("plane");
const start = document.getElementById("startAnimation");
const totalFrames = document.getElementById("totalFrames");
const display = document.getElementById("display");

start.addEventListener("click", () => {
	const framesCount = totalFrames.value;
	let frame = 0;
	const totalDistance = arc.getDistance("kilometers");

	const animate = () => {
		const distanceTravelled = totalDistance * frame / framesCount;
		display.value = `${Math.round(distanceTravelled)} / ${Math.round(totalDistance)} km`;
		const point = arc.getPointAt(distanceTravelled, "kilometers");

		plane.lng = point.lng;
		plane.lat = point.lat;
		if (frame < framesCount) {
			requestAnimationFrame(animate);
		}
		frame++;
	};
	animate();
});
