import geoJson from './states.geojson.json?url'; //?raw => as string
document.getElementById("states").setAttribute("geojson-url", geoJson);

const map = document.getElementById("map");
const layer = document.getElementById("layer");

layer.fillColor = [
	'interpolate',
	['linear'],
	['*', 1000, ['get', 'STATE_POP']],
	0,
	'#F2F12D',
	500000,
	'#EED322',
	750000,
	'#E6B71E',
	1000000,
	'#DA9C20',
	2500000,
	'#CA8323',
	5000000,
	'#B86B25',
	7500000,
	'#A25626',
	10000000,
	'#8B4225',
	25000000,
	'#723122'
];