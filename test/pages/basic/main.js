import mapStyle from './map-style.json?url'; //?raw => as string
import rasterStyle from './raster-style.json?url';
import geomapImage from './sap-vector-logo.png';

// set custom selection styles
window.configSelection.setSelectionStyles({
	fillColor: "#7FFFD4",
	fillOpacity: 0.7,
	outlineColor: "#0000FF",
	outlineWidth: 2,
	width: 50,
	dragndropHover: "#FF0000",
	bounceColor: "#0096FF"
});

window.configGeometry.setLongLatPrecision(5);

document.getElementById("customRaster").setAttribute("data-url", mapStyle);
document.getElementById("rasterTiles").setAttribute("url", rasterStyle);
document.getElementById("sapGeomapImage").setAttribute("url", geomapImage);

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

map.addEventListener("map-dblclick", event => {
	event.preventDefault();
	console.log(`Map double-clicked at ${event.detail.lng}, ${event.detail.lat}`);

	const container = document.createElement("ui5-geomap-container");
	container.lng = event.detail.lng;
	container.lat = event.detail.lat;
	container.innerHTML = `<div style="width: 0px; height: 0px;"></div>`;
	map.appendChild(container);

	container.addEventListener("close", () => {
		map.removeChild(container);
	});
	container.addEventListener("click", event => {
		setTimeout(() => {
			const popover = document.getElementById("dblclickInfo");
			popover.querySelector("#dblclickLng").innerText = container.lng;
			popover.querySelector("#dblclickLat").innerText = container.lat;
			popover.opener = container;
			popover.open = true;
			event.stopPropagation();
		});
	});
	container.click();
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

map.addEventListener("map-contextmenu", event => {
	event.preventDefault();
	console.log(`Map right-clicked at ${event.detail.lng}, ${event.detail.lat}`);

	const container = document.createElement("ui5-geomap-container");
	container.lng = event.detail.lng;
	container.lat = event.detail.lat;
	container.innerHTML = `<div class="opens-popup" style="background: white; width: 0px; height: 0px; cursor: pointer"></div>`;
	map.appendChild(container);

	container.addEventListener("close", () => {
		map.removeChild(container);
	});
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

const polygon = document.getElementById("poly");
polygon.addEventListener("layer-mouseenter", event => {
	polygon.fillColor = "pink";
	map.canvas.style.cursor = "crosshair";
});
polygon.addEventListener("layer-mouseleave", event => {
	polygon.fillColor = "orange";
	map.canvas.style.cursor = "";
});

document.getElementById("chooseStyle").addEventListener("selection-change", event => {
	const style = event.detail.selectedItems[0].getAttribute("data-url");
	const isCustom = !!event.detail.selectedItems[0].getAttribute("data-custom");
	let url = "";
	
	if (isCustom === true) {
		url = style;
	} else {
		url = "https://demotiles.maplibre.org/style.json";
	}

	document.querySelector("ui5-geomap-provider").styleUrl = url;
});

document.getElementById("overlayMap").addEventListener("change", () => {
	document.getElementById("rasterTiles").hidden = !document.getElementById("overlayMap").checked;
});

document.getElementById("overlaySlider").addEventListener("change", () => {
	document.getElementById("rasterTiles").opacity = document.getElementById("overlaySlider").value / 100;
});


let interval1 = null;
document.getElementById("increase1").addEventListener("click", () => {
	[...document.getElementsByTagName("ui5-geomap-geocircle")].forEach(circle => {
		circle.radius += 2;
	});
});

document.getElementById("insert1").addEventListener("click", () => {
	const point = document.createElement("ui5-geomap-point");
	point.lng = 6.97776992628539;
	point.lat = 49.230847501917225;
	document.getElementById("poly").appendChild(point);
});

document.getElementById("newyork").addEventListener("click", () => {
	document.getElementById("map").flyTo(-74.0060, 40.7128, 7);
});
document.getElementById("heidl").addEventListener("click", () => {
	document.getElementById("map").flyTo(8.6724, 49.3988, 7);
});

document.getElementById("overlayMap").addEventListener("change", () => {
	document.getElementById("rasterTiles").hidden = !document.getElementById("overlayMap").checked;
});


document.getElementById("overlaySlider").addEventListener("change", () => {
	document.getElementById("rasterTiles").opacity = document.getElementById("overlaySlider").value / 100;
});

// #region evenListener spot3
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
// #endregion