const myMap = document.getElementById("myMap");
const selCtrl = document.getElementById("selCtrl");

const outlinePicker = document.getElementById("outlinePicker");
const fillPicker = document.getElementById("fillPicker");
const zoomButton = document.getElementById("zoomButton");
const validatorButton = document.getElementById("validatorButton");
const boundsArea = document.getElementById("boundsArea");
const bounds = [
	[
		8.621441609,
		49.317169598
	],
	[
		8.659278409,
		49.317089687
	],
	[
		8.65865935,
		49.295831885
	],
	[
		8.621915501,
		49.296909446
	],
	[
		8.621441609,
		49.317169598
	]
];
function rgbToHex(rgbString) {
	const startIndex = rgbString.indexOf("(") + 1,
		endIndex = rgbString.indexOf(")"),
		values = rgbString.substring(startIndex, endIndex).split(',').slice(0, 3);
	const result = values.map(color => {
		const intColor = parseInt(color),
			hex = intColor.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	});
	return result.join('');
}

// set custom selection styles
window.configSelection.setSelectionStyles({
	fillColor: "#7FFFD4",
	fillOpacity: 0.7,
	outlineColor: "#0000FF",
	outlineWidth: 2,
	width: 50,
	dragndropHover: "#FF0000"
});

window.configGeometry.setLongLatPrecision(5);

boundsArea.setAttribute("value", JSON.stringify(bounds, undefined, 4));

zoomButton.addEventListener("click", () => {
	const bounds = JSON.parse(boundsArea.value);
	myMap.perfectZoom(bounds);
});

validatorButton.addEventListener("click", (e) => {
	let enabled = validatorButton.getAttribute("data-ui5-mode");
	if (enabled === "1") {
		enabled = "0";
		validatorButton.textContent = "Disable Validator";
		validatorButton.setAttribute("design", "Negative");
		selCtrl.setValidator((feature, context) => {
			if (context.updateType === "finish" || context.updateType === "commit") {
				return geometry.NotSelfIntersectingValidation(feature);
			}
			return true;
		});
	} else {
		enabled = "1";
		validatorButton.textContent = "Enable Validator";
		validatorButton.setAttribute("design", "Positive");
		selCtrl.setValidator((feature, context) => {
			return true;
		});
	}
	validatorButton.setAttribute("data-ui5-mode", enabled);
	console.log("Enabled:", enabled);
});

myMap.addEventListener("selection-finish", (evt) => {
	console.log("Selection finish event:", evt.detail);
	const selections = selCtrl.selections;
	const prettyContent = JSON.stringify(selections, undefined, 4);
	document.getElementById("selectionTextArea").setAttribute("value", prettyContent);

	const geom = evt.detail.snapshot[0].geometry.coordinates;
	const itemsInArea = myMap.getElementsInSelectedArea(geom);
	document.getElementById("selectionItemsTextArea").setAttribute("value", JSON.stringify(itemsInArea, undefined, 4));
});
myMap.addEventListener("selection-item", (evt) => {
	console.log(evt);
});

outlinePicker.addEventListener("change", (evt) => {
	// selCtrl.setAttribute("outline-color", rgbToHex(outlinePicker.value));
	const oSelStyle = window.configSelection.getSelectionStyles();
	oSelStyle.outlineColor = `#${rgbToHex(outlinePicker.value)}`;
	window.configSelection.setSelectionStyles(oSelStyle);
	selCtrl.setModeStyles(window.configSelection.getSelectionStyles());
});

fillPicker.addEventListener("change", (evt) => {
	// selCtrl.setAttribute("fill-color", rgbToHex(fillPicker.value));
	const oSelStyle = window.configSelection.getSelectionStyles();
	oSelStyle.fillColor = `#${rgbToHex(fillPicker.value)}`;
	window.configSelection.setSelectionStyles(oSelStyle);
	selCtrl.setModeStyles(window.configSelection.getSelectionStyles());
});

myMap.addEventListener("map-click", event => {
	console.log(`Map clicked at ${event.detail.lng}, ${event.detail.lat}`);
});

myMap.addEventListener("map-load", () => {
	const map = myMap.map; // maplibre object

	setTimeout(() => {
		map.addLayer(
			{
				'id': 'earthquakes-layer',
				'type': 'circle',
				'source': 'earthquakes',
				'paint': {
					'circle-radius': 4,
					'circle-stroke-width': 2,
					'circle-color': 'red',
					'circle-stroke-color': 'white'
				}
			}
		);
	});

});