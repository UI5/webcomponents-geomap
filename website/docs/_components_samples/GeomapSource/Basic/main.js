import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapSource.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircleLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapSymbolLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";

const map = document.getElementById("map");
const source = document.getElementById("data");
const layer = document.getElementById("layer");
const labels = document.getElementById("labels");

layer.radius = ["*", 5, ["get", "mag"]];
layer.fillColor = [
	"step",
	["get", "mag"],
	"green",
	3,
	"orange",
	4,
	"red",
	5,
	"purple",
];

labels.textFont = ["Arial Unicode MS Regular"];
labels.text = [
	"number-format",
	["get", "mag"],
	{ "min-fraction-digits": 1, "max-fraction-digits": 1 },
];

(async () => {
	const data = await (await fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02")).json();
	source.geojson = data;
	console.log("Total features: ", data);
	console.log("Total features: ", data.features.length);

	setInterval(() => {
		data.features.forEach(feature => {
			feature.properties.mag += (Math.random() / 10) * (Math.random() < 0.5 ? -1 : 1);
			feature.geometry.coordinates[0] += (Math.random() / 10) * (Math.random() < 0.5 ? -1 : 1);
			feature.geometry.coordinates[1] += (Math.random() / 10) * (Math.random() < 0.5 ? -1 : 1);
		});
		source.geojson = { ...data };
	}, 1000);
})();
