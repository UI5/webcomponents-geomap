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
		const distanceTravelled = totalDistance * frame/framesCount;
		display.value = `${Math.round(distanceTravelled)} / ${Math.round(totalDistance)} km`;
		const point = arc.getPointAt(distanceTravelled, "kilometers")

		plane.lng = point.lng;
		plane.lat = point.lat;
		if (frame < framesCount) {
			requestAnimationFrame(animate);
		}
		frame++;
	};
	animate();
});
