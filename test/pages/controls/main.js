const map = document.getElementById("map");

map.addEventListener("map-click", event => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);

});