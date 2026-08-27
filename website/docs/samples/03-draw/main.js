import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapPolygon.js";
import "@ui5/webcomponents-geomap/dist/GeomapLine.js";
import "@ui5/webcomponents-geomap/dist/GeomapPoint.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircle.js";
import "@ui5/webcomponents/dist/Toast.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Label.js";

const map = document.getElementById("map");
const polygon = document.getElementById("poly");
const line = document.getElementById("line");
const tempLine = document.getElementById("tempLine");

let closed = false;
const allCorners = [];
let firstCorner = null;
let draggedCorner = null;

const updatePolygon = () => {
	if (closed) {
		[...polygon.children].forEach(child => {
			polygon.removeChild(child);
		});
		allCorners.forEach(corner => {
			const point = document.createElement("ui5-geomap-point");
			point.lng = corner.lng;
			point.lat = corner.lat;
			polygon.appendChild(point);
		});
	}
};

const updateLine = () => {
	[...line.children].forEach(child => {
		line.removeChild(child);
	});
	allCorners.forEach(corner => {
		const point = document.createElement("ui5-geomap-point");
		point.lng = corner.lng;
		point.lat = corner.lat;
		line.appendChild(point);
	});
	if (closed) {
		line.appendChild(line.children[0].cloneNode());
	}
};

const updateTempLine = (lng, lat) => {
	[...tempLine.children].forEach(child => {
		tempLine.removeChild(child);
	});

	if (!lng || !lat) {
		return;
	}

	let point = document.createElement("ui5-geomap-point");
	point.lng = allCorners[allCorners.length - 1].lng;
	point.lat = allCorners[allCorners.length - 1].lat;
	tempLine.appendChild(point);

	point = document.createElement("ui5-geomap-point");
	point.lng = lng;
	point.lat = lat;
	tempLine.appendChild(point);
};

const createCorner = (lng, lat) => {
	const corner = document.createElement("ui5-geomap-circle");
	corner.lng = lng;
	corner.lat = lat;
	corner.radius = 10;
	corner.fillColor = "blue";
	corner.outlineColor = "white";
	corner.outlineWidth = 2;
	map.appendChild(corner);
	allCorners.push(corner);
	if (firstCorner === null) {
		firstCorner = corner;
	}

	if (allCorners.length === 3) {
		document.getElementById("toast").open = true;
	}

	corner.addEventListener("layer-mouseenter", () => {
		map.canvas.style.cursor = "grabbing";
		corner.outlineColor = "orange";
		if (corner === firstCorner && allCorners.length > 2) {
			corner.outlineWidth = 10;
		}
	});

	corner.addEventListener("layer-mouseleave", () => {
		map.canvas.style.cursor = "";
		corner.outlineColor = "white";
		corner.outlineWidth = 2;
	});

	corner.addEventListener("layer-mousedown", event => {
		event.preventDefault();
		map.canvas.style.cursor = "grab";
		draggedCorner = corner;
	});
};

map.addEventListener("map-click", event => {
	if (closed) {
		return;
	}

	const layers = map.getLayersAt(event.detail.point);

	if (firstCorner && layers.includes(firstCorner)) {
		if (allCorners.length > 2) {
			closed = true;
			updatePolygon();
			updateLine();
			updateTempLine();
			firstCorner = null;
		}
	} else {
		createCorner(event.detail.lng, event.detail.lat);
		updateLine();
	}
});

map.addEventListener("map-mousemove", event => {
	if (draggedCorner) {
		draggedCorner.lng = event.detail.lng;
		draggedCorner.lat = event.detail.lat;
		if (closed) {
			updatePolygon();
		}
		updateLine();
	}

	if (!closed && allCorners.length > 0) {
		updateTempLine(event.detail.lng, event.detail.lat);
	}
});

map.addEventListener("map-mouseup", event => {
	if (draggedCorner) {
		draggedCorner = null;
	}
});
