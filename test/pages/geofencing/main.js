// set custom selection styles
window.configSelection.setSelectionStyles({
	fillColor: "#4AA340",
	outlineColor: "0000FF",
	dragndropHover: "FF0000",
	fillOpacity: 0.7,
	outlineWidth: 2,
	width: 50,
});

window.configGeometry.setLongLatPrecision(5);

const map = document.getElementById("map");
const selCtrl = document.getElementById("selCtrl");

map.addEventListener("mousedown", (event) => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);
	const map = document.getElementById("map");
	const feature = map.draw._store.store;
	const featureId = Object.keys(feature)[0];
	if (!feature[featureId]) {
		return;
	}
	let container = document.getElementById("menuContainer_" + featureId);
	if (!container) {
		container = document.createElement("ui5-geomap-container");
		container.id = "menuContainer_" + featureId;

		const coords = Array.isArray(feature[featureId].geometry.coordinates[0]) ? feature[featureId].geometry.coordinates[0][0] : feature[featureId].geometry.coordinates;
		container.lng = coords[0];
		container.lat = coords[1];

		map.appendChild(container);

		container.addEventListener("click", e => {
			e.preventDefault();
			setTimeout(() => {
				let menu = document.getElementById("menuBasic");
				menu.opener = container;
				menu.open = true;
				e.stopPropagation();
			}, 0);
		});
	}

	// container.lng = coords[0];
	// container.lat = coords[1];


	if(event.button === 2) {
		container.click();
	}

});

map.addEventListener("selection-finish", event => {
	if (event.detail) {
		console.log("selection-finish", event.detail);
	}
});

map.addEventListener("selection-item", (evt) => {
	 console.log(evt);
	 selectedControl = evt.detail.selObj;
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
