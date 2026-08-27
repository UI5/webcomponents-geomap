import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapSource.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircleLayer.js";

const geoJsonData1 = {
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
const geoJsonData2 = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"properties": {
			},
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.17,
					49.11486612786396,
				],
			},
		},
		{
			"type": "Feature",
			"properties": {
			},
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.47,
					49.11486612786396,
				],
			},
		},
	],
};
const geoJsonData3 = {
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"properties": {
			},
			"geometry": {
				"type": "Point",
				"coordinates": [
					6.47,
					49.11486612786396,
				],
			},
		},
	],
};

const source1 = document.getElementById("data1");
const source2 = document.getElementById("data2");
const source3 = document.getElementById("data3");

source1.geojson = geoJsonData1;
source2.geojson = geoJsonData2;
source3.geojson = geoJsonData3;
