const map = document.getElementById("map");

map.addEventListener("map-click", event => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);
});

const restrict = document.getElementById("restrict");
const wslng = document.getElementById("wslng");
const wslat = document.getElementById("wslat");
const enlng = document.getElementById("enlng");
const enlat = document.getElementById("enlat");
const minZoomSlider = document.getElementById("minZoomSlider");
const maxZoomSlider = document.getElementById("maxZoomSlider");
const minTiltSlider = document.getElementById("minTiltSlider");
const maxTiltSlider = document.getElementById("maxTiltSlider");

restrict.addEventListener("change", () => {
	const checked = restrict.checked;
	wslng.disabled = !checked;
	wslat.disabled = !checked;
	enlng.disabled = !checked;
	enlat.disabled = !checked;
	map.restrictedAreaWestSouthPointLng = checked ? parseFloat(wslng.value) : 0;
	map.restrictedAreaWestSouthPointLat = checked ? parseFloat(wslat.value) : 0;
	map.restrictedAreaEastNorthPointLng = checked ? parseFloat(enlng.value) : 0;
	map.restrictedAreaEastNorthPointLat = checked ? parseFloat(enlat.value) : 0;
});

wslng.addEventListener("change", () => map.restrictedAreaWestSouthPointLng = parseFloat(wslng.value));
wslat.addEventListener("change", () => map.restrictedAreaWestSouthPointLat = parseFloat(wslat.value));
enlng.addEventListener("change", () => map.restrictedAreaEastNorthPointLng = parseFloat(enlng.value));
enlat.addEventListener("change", () => map.restrictedAreaEastNorthPointLat = parseFloat(enlat.value));

minZoomSlider.addEventListener("change", () => map.minZoom = minZoomSlider.value);
maxZoomSlider.addEventListener("change", () => map.maxZoom = maxZoomSlider.value);
minTiltSlider.addEventListener("change", () => map.minTilt = minTiltSlider.value);
maxTiltSlider.addEventListener("change", () => map.maxTilt = maxTiltSlider.value);