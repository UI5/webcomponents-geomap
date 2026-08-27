import geoJson from './data1.geojson.json?url'; //?raw => as string
document.getElementById("data1").setAttribute("geojson-url", geoJson);

const myMap = document.getElementById("myMap");
const hm = document.getElementById("hm");
const circles = document.getElementById("circles");
const labels = document.getElementById("labels");

hm.color = [
	'interpolate',
	['linear'],
	['heatmap-density'],
	0,
	'rgba(33,102,172,0)',
	0.2,
	'rgb(77 177 255)',
	0.4,
	'rgb(209,229,240)',
	0.6,
	'rgb(253,219,199)',
	0.8,
	'rgb(239,138,98)',
	1,
	'rgb(233 11 11)'
];

hm.weight = [
	'interpolate',
	['linear'],
	['get', 'STORES_PROFIT'],
	0,
	0,
	50000,
	10
];

hm.radius = [
	'interpolate',
	['linear'],
	['get', 'STORES_COUNT'],
	1,
	30,
	10,
	300
];

circles.radius = [
	'interpolate',
	['linear'],
	['get', 'STORES_COUNT'],
	1,
	10,
	10,
	50
];

circles.opacity = [
	'interpolate',
	['linear'],
	['zoom'],
	10,
	0,
	11,
	0.5
];

labels.textFont = ["Arial Unicode MS Regular"];
labels.text = ['get', 'STORES_COUNT'];
labels.textOffset = [0, 0];
