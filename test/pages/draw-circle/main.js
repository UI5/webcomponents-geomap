const map = document.getElementById("map");
const circle = document.getElementById("circle");
const line = document.getElementById("line");
const tempLine = document.getElementById("tempLine");
const polygon = document.getElementById("poly");

let closed = false;
const allEdges = [];
let firstEdge = null;
let draggedEdge = null;

const updateCircle = (isRadiusEdge = false, isFinal = false) => {
	if (closed) {
		let p1 = window.geometry.geomapPoint([allEdges[0].lng, allEdges[0].lat]);
		let p2 = window.geometry.geomapPoint([allEdges[1].lng, allEdges[1].lat]);

		if (draggedEdge) {
			if (isRadiusEdge) {
				// nothing
				console.log("corner");
				p2 = window.geometry.geomapPoint([draggedEdge.lng, draggedEdge.lat]);
			} else {
				if (isFinal) {
					console.log("final");
					circle.lng = allEdges[0].lng;
					circle.lat = allEdges[0].lat;
				} else {
					console.log("center")
					circle.lng = draggedEdge ? draggedEdge.lng : allEdges[0].lng;
					circle.lat = draggedEdge ? draggedEdge.lat : allEdges[0].lat;
				}
			}
		} else {
			console.log("center2")
			circle.lng = allEdges[0].lng;
			circle.lat = allEdges[0].lat;
		}
		let radius = 0;
		if (isRadiusEdge) {
			radius = window.geometryUtil.pointDistance(p1, p2, {units: "kilometers"});
		} else {

			radius = window.geometryUtil.pointDistance(p1, p2, {units: "kilometers"});
		}
		console.log(radius);
		circle.radius = draggedEdge && !isRadiusEdge ? circle.radius : radius;


		// check the same creating polygon using edges calculated
		// const center = p1;
		// const iRadius = radius;
		// const options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
		// const tmpCircle = window.geometry.geomapCircle(center, iRadius, options);
	}
}


const updatePolygon = (coords) => {
	if (closed) {
		[...polygon.children].forEach(child => {
			polygon.removeChild(child);
		});
		coords.forEach(corner => {
			const point = document.createElement("ui5-geomap-point");
			point.lng = corner[0];
			point.lat = corner[1];
			polygon.appendChild(point);
		});
	}
}

const updateTempLine = (lng, lat) => {
	[...tempLine.children].forEach(child => {
		tempLine.removeChild(child);
	});

	if (!lng || !lat) {
		return;
	}

	let point = document.createElement("ui5-geomap-point");
	point.lng = allEdges[allEdges.length - 1].lng;
	point.lat = allEdges[allEdges.length - 1].lat;
	const po1 = point;
	tempLine.appendChild(point);

	point = document.createElement("ui5-geomap-point");
	point.lng = lng;
	point.lat = lat;
	const po2 = point;
	tempLine.appendChild(point);

	// calc dist

	const p1 = window.geometry.geomapPoint([po1.lng, po1.lat]);
	const p2 = window.geometry.geomapPoint([po2.lng, po2.lat]);
	const radius = window.geometryUtil.pointDistance(p1, p2, {units: "kilometers"});
	console.log(radius);

};

const removeRadiusEdge = (lng, lat) => {
	let point = {};
	point.lng = allEdges[allEdges.length - 1].lng;
	point.lat = allEdges[allEdges.length - 1].lat;
	const allCirleEdges = document.querySelector("ui5-geomap-point");
	map.removeChild(allCirleEdges)
}

const createEdge = (lng, lat, radius = 10, isRadiusEdge = false) => {
	const edge = document.createElement("ui5-geomap-circle");
	// const edge = document.createElement("ui5-geomap-geocircle");
	edge.lng = lng;
	edge.lat = lat;
	edge.radius = radius;
	edge.fillColor = "blue";
	edge.outlineColor = "white";
	edge.outlineWidth = 2;
	edge.setAttribute("isRadiusEdge", isRadiusEdge);
	map.appendChild(edge);
	allEdges.push(edge);
	if (firstEdge === null) {
		firstEdge = edge;
	}

	if (allEdges.length === 2) {
		document.getElementById("toast").open = true;
	}

	edge.addEventListener("layer-mouseenter", () => {
		map.canvas.style.cursor = "grabbing";
		edge.outlineColor = "orange";
		if (edge === firstEdge && allEdges.length > 1) {
			edge.outlineWidth = 10;
		}
	});

	edge.addEventListener("layer-mouseleave", () => {
		map.canvas.style.cursor = "";
		edge.outlineColor = "white";
		edge.outlineWidth = 2;
	});

	edge.addEventListener("layer-mousedown", event => {
		event.preventDefault();
		map.canvas.style.cursor = "grab";
		draggedEdge = edge;
	});
};

map.addEventListener("map-click", event => {

	if (closed && (!draggedEdge || !draggedEdge.getAttribute("isRadiusEdge"))) {
		return;
	}

	/*if (draggedEdge) {
		draggedEdge.lng = event.detail.lng;
		draggedEdge.lat = event.detail.lat;
		if (closed) {
			updateCircle();
		}
		draggedEdge = null;
	}
*/
	if (allEdges.length >= 1) { // already have one edge as "center"
		if (!draggedEdge) {
			createEdge(event.detail.lng, event.detail.lat, 4, true);
		} // create the second one
		closed = true;
		const isRadiusEdge = draggedEdge && draggedEdge.getAttribute("isRadiusEdge") ? true : false;
		updateCircle(isRadiusEdge, true);
		updateTempLine();
		firstEdge = null;
		draggedEdge = null;
	} else {
		createEdge(event.detail.lng, event.detail.lat);
	}
});

map.addEventListener("map-mousemove", event => {
	if (draggedEdge) {
		draggedEdge.lng = event.detail.lng;
		draggedEdge.lat = event.detail.lat;
		const isRadiusEdge = draggedEdge.getAttribute("isRadiusEdge");
		if (closed) {
			updateCircle(isRadiusEdge);
		}
	}

	if (!closed && allEdges.length > 0) {
		updateTempLine(event.detail.lng, event.detail.lat);
	}
});

map.addEventListener("map-mouseup", event => {
	/*if (draggedEdge) {
		draggedEdge = null;
	}*/
});

map.addEventListener('touchstart',  (e) => {
console.log("aaa");
});
