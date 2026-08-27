import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapSource.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircleLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapSymbolLayer.js";

import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Label.js";

const map = document.getElementById("map");
const objects = document.getElementById("objects");
const labels = document.getElementById("labels");

labels.textFont = ["Arial Unicode MS Regular"];
labels.text = ["get", "name"];
map.addEventListener("map-load", async () => {
	const getData = async () => {
		return new Promise(resolve => {
			setTimeout(() => {
				const bounds = map.getBounds();
				console.log("Bounds: ", bounds);

				const points = [];
				for (let i = 0; i < 10; i++) {
					const lng = bounds.west + (bounds.east - bounds.west) * Math.random();
					const lat = bounds.south + (bounds.north - bounds.south) * Math.random();
					points.push({
						type: "Feature",
						properties: {
							name: `Item ${i + 1}`,
						},
						geometry: {
							type: "Point",
							coordinates: [lng, lat],
						},
					});
				}

				const geojson = {
					type: "FeatureCollection",
					features: points,
				};

				resolve(geojson);
			}, 100); // simulate server request for 100ms
		});
	};

	objects.geojson = await getData();
	map.addEventListener("map-bounds-change", async () => {
		objects.geojson = await getData();
	});
});
