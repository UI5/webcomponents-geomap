// set custom selection styles
window.configSelection.setSelectionStyles({
	fillColor: "#7FFFD4",
	fillOpacity: 0.7,
	outlineColor: "#0000FF",
	outlineWidth: 2,
	width: 50,
	dragndropHover: "#FF0000"
});

window.configGeometry.setLongLatPrecision(5);

const map = document.getElementById("map");

map.addEventListener("map-click", event => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);
});

map.addEventListener("selection-finish", event => {
	if (event.detail) {
		console.log("selection-finish", event.detail);
	}
});

map.addEventListener("selection-item", (evt) => {
	console.log(evt.detail);
});

map.addEventListener("polygon-dragndrop-end", (evt) => {
	console.log("polygon moved:", evt.detail);
});

map.addEventListener("circle-dragndrop-end", (evt) => {
	console.log("circle moved:", evt.detail);
});

map.addEventListener("geocircle-dragndrop-end", (evt) => {
	console.log("geocircle moved:", evt.detail);
});

map.addEventListener("line-dragndrop-end", (evt) => {
	console.log("line moved:", evt.detail);
});

map.addEventListener("map-error", event => {
	console.log(`Map error: ${event.detail.error}`);
});

const spot3 = document.getElementById("spot3");
spot3.addEventListener("click", event => {
	const container = document.createElement("ui5-geomap-container");
	container.lng = event.target.lng;
	container.lat = event.target.lat;
	container.innerHTML = `<div class="opens-popup" style="background: white; width: 0px; height: 0px; cursor: pointer"></div>`;
	map.appendChild(container);

	container.addEventListener("click", event => {
		setTimeout(() => {
			let info = document.getElementById("spotInfo");
			info.querySelector('#spotId').innerText= "Spot 3";
			info.querySelector('#spotLng').innerText= event.target.lng;
			info.querySelector('#spotLat').innerText= event.target.lat;
			info.opener = container;
			info.open = true;
			event.stopPropagation();
		});
	});
	container.click();
});
spot3.addEventListener("right-click", event => {
	const container = document.createElement("ui5-geomap-container");
	container.id ="menuContainer"
	container.lng = event.target.lng;
	container.lat =event.target.lat;
	map.appendChild(container);

	container.addEventListener("click", event => {
		setTimeout(() => {
			let menu = document.getElementById("menuBasic");
			menu.opener = container
			menu.open = true;
			event.stopPropagation();
		});
	});
	container.click();
});