import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapSource.js";
import "@ui5/webcomponents-geomap/dist/GeomapHeatmapLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircleLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapSymbolLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";

const geoJsonData = {
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

const myMap = document.getElementById("myMap");
const source = document.getElementById("data1");
const hm = document.getElementById("hm");
const circles = document.getElementById("circles");
const labels = document.getElementById("labels");

source.geojson = geoJsonData;

hm.color = [
	"interpolate",
	["linear"],
	["heatmap-density"],
	0,
	"rgba(33,102,172,0)",
	0.2,
	"rgb(77 177 255)",
	0.4,
	"rgb(209,229,240)",
	0.6,
	"rgb(253,219,199)",
	0.8,
	"rgb(239,138,98)",
	1,
	"rgb(233 11 11)",
];

hm.weight = [
	"interpolate",
	["linear"],
	["get", "STORES_PROFIT"],
	0,
	0,
	50000,
	10,
];

hm.radius = [
	"interpolate",
	["linear"],
	["get", "STORES_COUNT"],
	1,
	30,
	10,
	300,
];

circles.radius = [
	"interpolate",
	["linear"],
	["get", "STORES_COUNT"],
	1,
	10,
	10,
	50,
];

circles.opacity = [
	"interpolate",
	["linear"],
	["zoom"],
	10,
	0,
	11,
	0.5,
];

labels.textFont = ["Arial Unicode MS Regular"];
labels.text = ["get", "STORES_COUNT"];
labels.textOffset = [0, 0];
