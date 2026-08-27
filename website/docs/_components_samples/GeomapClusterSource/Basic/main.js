import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapClusterSource.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircleLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapSymbolLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/List.js";

const geoJson = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"properties": {
				"STORES_COUNT": 2,
				"STORES_PROFIT": 10000,
			},
			"id": 1,
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.25,
					49.18,
				],
			},
		},
		{
			"type": "Feature",
			"properties": {
				"STORES_COUNT": 1,
				"STORES_PROFIT": 25000,
			},
			"id": 2,
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.178709215272448,
					49.11486612786396,
				],
			},
		},
		{
			"type": "Feature",
			"properties": {
				"STORES_COUNT": 1,
				"STORES_PROFIT": 7000,
			},
			"id": 3,
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.33,
					49.11486612786396,
				],
			},
		},
		{
			"type": "Feature",
			"properties": {
				"STORES_COUNT": 1,
				"STORES_PROFIT": 12000,
			},
			"id": 4,
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.458709215272448,
					49.11486612786396,
				],
			},
		},
		{
			"type": "Feature",
			"properties": {
				"STORES_COUNT": 3,
				"STORES_PROFIT": 20000,
			},
			"id": 5,
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.49,
					49.11486612786396,
				],
			},
		},
	],
};

const map = document.getElementById("map");
const source = document.getElementById("data1");
source.geojson = geoJson;
const points_unclustered = document.getElementById("points_unclustered");
const points_clustered = document.getElementById("points_clustered");
const points_clustered_labels = document.getElementById("points_clustered_labels");
const popover = document.getElementById("info");
const zoom = document.getElementById("zoom");

points_clustered_labels.textFont = ["Arial Unicode MS Regular"];
points_clustered_labels.text = ["get", "point_count"];
points_clustered_labels.textSize = [
	"step",
	["get", "point_count"],
	16,
	3,
	18,
	5,
	20,
];

points_clustered.radius = [
	"step",
	["get", "point_count"],
	30,
	3,
	40,
	5,
	50,
];

let clickedCluster;

points_clustered.addEventListener("layer-click", async event => {
	clickedCluster = event.detail.cluster;
	const leaves = await clickedCluster.getLeaves();
	const children = await clickedCluster.getChildren();

	console.log("Leaves: ", leaves);
	console.log("Children: ", children);

	[...info.querySelector("ui5-list#leaves").children].forEach(child => child.parentElement.removeChild(child));
	leaves.forEach(feature => {
		const li = document.createElement("ui5-li");
		li.textContent = `${feature.properties.STORES_PROFIT} EUR`;
		info.querySelector("ui5-list#leaves").appendChild(li);
	});

	info.opener = event.detail.dom;
	info.open = true;
});

zoom.addEventListener("click", async () => {
	if (clickedCluster) {
		info.open = false;
		await clickedCluster.expand();
	}
});
