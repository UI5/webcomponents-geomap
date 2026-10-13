import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapScaleControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapSelectionControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapCopyrightControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapContainer.js";
import "@ui5/webcomponents-geomap/dist/GeomapSpot.js";
import "@ui5/webcomponents-geomap/dist/GeomapLine.js";
import "@ui5/webcomponents-geomap/dist/GeomapPoint.js";
import "@ui5/webcomponents-geomap/dist/GeomapCircle.js";
import GeomapGeometry from "@ui5/webcomponents-geomap/dist/geometry/GeomapGeometry.js";
import GeomapGeometryUtil from "@ui5/webcomponents-geomap/dist/geometry/GeomapGeometryUtil.js";
import { renderFinished } from "@ui5/webcomponents-base/dist/Render.js";

import "@ui5/webcomponents-fiori/dist/ShellBar.js";

import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/ComboBox.js";
import "@ui5/webcomponents/dist/ComboBoxItem.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Text.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Tag.js";
import "@ui5/webcomponents/dist/Toolbar.js";
import "@ui5/webcomponents/dist/ToolbarButton.js";
import "@ui5/webcomponents/dist/Avatar.js";
import "@ui5/webcomponents/dist/Dialog.js";
import "@ui5/webcomponents/dist/ColorPicker.js";
import "@ui5/webcomponents/dist/TextArea.js";
import "@ui5/webcomponents/dist/Tab.js";
import "@ui5/webcomponents/dist/TabContainer.js";
import "@ui5/webcomponents/dist/Bar.js";
import "@ui5/webcomponents/dist/Panel.js";
import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/ListItemStandard.js";
import "@ui5/webcomponents/dist/Menu.js";
import "@ui5/webcomponents/dist/MenuItem.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents-icons/dist/customer.js";
import "@ui5/webcomponents-icons/dist/action-settings.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/zoom-in.js";
import "@ui5/webcomponents-icons/dist/paper-plane.js";
import "@ui5/webcomponents-icons/dist/information.js";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/map.js";
import "@ui5/webcomponents-icons/dist/map-fill.js";
import "@ui5/webcomponents-icons/dist/favorite.js";
import "@ui5/webcomponents-icons/dist/decline.js";
import "@ui5/webcomponents-icons/dist/arobase.js";

const AIRPORTS_GEOJSON_URL = "../assets/airports.geojson";

const sampleBounds = [
	[8.621441609, 49.317169598],
	[8.659278409, 49.317089687],
	[8.65865935, 49.295831885],
	[8.621915501, 49.296909446],
	[8.621441609, 49.317169598],
];

const restrictedBounds = [
	[
		[-74.808479517, 41.144514492],
		[-72.761423397, 41.117057974],
		[-72.918577987, 39.860409659],
		[-74.947131091, 39.978392597],
		[-74.808479517, 41.144514492],
	],
];

// ─── State ────────────────────────────────────────────────────────────────────
let initialData = {};
let flyToDestCoords = [0, 0];
let distanceMeasureStarted = false;
let currentSpotData = null;
let measureLineStart = null;

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const myMap = document.getElementById("myMap");
const selCtrl = document.getElementById("selCtrl");
const counter = document.getElementById("counter");
const boundsArea = document.getElementById("boundsArea");
const restrictedBoundsArea = document.getElementById("restrictedBoundsArea");
const distanceLine = document.getElementById("distanceLine");
const distFromCircle = document.getElementById("distFromCircle");
const distToCircle = document.getElementById("distToCircle");
const infoContainer = document.getElementById("infoContainer");
const spotContainer = document.getElementById("spotContainer");
const spotInfoContainer = document.getElementById("spotInfoContainer");
const genericInfoContainer = document.getElementById("genericInfoContainer");
const measureLine = document.getElementById("measureLine");

// ─── Init ─────────────────────────────────────────────────────────────────────
boundsArea.setAttribute("value", JSON.stringify(sampleBounds, undefined, 4));
restrictedBoundsArea.setAttribute("value", JSON.stringify(restrictedBounds, undefined, 4));

fetch(AIRPORTS_GEOJSON_URL)
	.then(r => r.json())
	.then(data => {
		initialData = data;
		counter.textContent = initialData.features.length;
		displayOnMap(initialData.features);
	});

// ─── Filter ───────────────────────────────────────────────────────────────────
document.getElementById("filterBtn").addEventListener("click", () => {
	counter.textContent = filterAndDisplay();
});

function filterAndDisplay() {
	const scaleRank = document.getElementById("scaleRankFilter").value;
	const type = document.getElementById("typeFilter").value;
	const location = document.getElementById("locationFilter").value;
	const natlscale = document.getElementById("natlScaleFilter").value;

	const query = {};
	if (scaleRank) query.scalerank = [parseInt(scaleRank)];
	if (type) query.type = [type];
	if (location) query.location = [location];
	if (natlscale) query.natlscale = [parseInt(natlscale)];

	const filtered = initialData.features.filter(f => {
		for (const key in query) {
			if (!query[key].includes(f.properties[key])) return false;
		}
		return true;
	});

	displayOnMap(filtered);
	return filtered.length;
}

// ─── Display airports ─────────────────────────────────────────────────────────
function displayOnMap(features) {
	[...myMap.querySelectorAll("ui5-geomap-spot")].forEach(s => myMap.removeChild(s));

	features.slice(0, 10000).forEach(feature => {
		const { type, cartodb_id, name, abbrev, iata_code, natlscale, scalerank, location, wikipedia } =
			feature.properties;
		const [lng, lat] = feature.geometry.coordinates;

		const spot = document.createElement("ui5-geomap-spot");
		spot.id = cartodb_id;
		spot.lng = lng;
		spot.lat = lat;
		spot.color = type && type.includes("military") ? "teal" : "#0057D2";
		spot.icon = type && type.includes("spaceport") ? "favorite" : "map";
		spot.width = type === "major" ? "2rem" : type === "mid" ? "1.5rem" : "1rem";
		spot.height = spot.width;

		spot.addEventListener("click", () => {
			spotContainer.lng = lng;
			spotContainer.lat = lat;
			spotContainer.addEventListener("click", e => {
				setTimeout(() => {
					document.getElementById("spotId").innerText = name || "";
					document.getElementById("spotLng").innerText = lng;
					document.getElementById("spotLat").innerText = lat;
					document.getElementById("spotSize").innerText = type || "";
					document.getElementById("spotAbbrev").innerText = abbrev || "";
					document.getElementById("spotIata").innerText = iata_code || "";
					document.getElementById("spotScalerank").innerText = scalerank || "";
					document.getElementById("spotNatlscale").innerText = natlscale || "";
					document.getElementById("spotLocation").innerText = location || "";
					document.getElementById("spotWiki").innerText = wikipedia || "";
					const info = document.getElementById("spotInfo");
					info.opener = spotContainer;
					info.open = true;
					e.stopPropagation();
				});
			}, { once: true });
			spotContainer.click();
		});

		spot.addEventListener("right-click", e => {
			currentSpotData = { id: cartodb_id, name, lat, lng, type, location, natlscale, scalerank };
			spotInfoContainer.lng = lng;
			spotInfoContainer.lat = lat;
			spotInfoContainer.addEventListener("click", ev => {
				setTimeout(() => {
					const menu = document.getElementById("spotMenu");
					menu.opener = spotInfoContainer;
					menu.open = true;
					ev.stopPropagation();
				});
			}, { once: true });
			spotInfoContainer.click();
			e.preventDefault();
		});

		myMap.appendChild(spot);
	});
}

// ─── Add / Edit location ──────────────────────────────────────────────────────
let dialogMode = "add";
let editItemId = null;

document.getElementById("addLocationBtn").addEventListener("click", () => {
	openAddDialog("add");
});

document.getElementById("closeAddDialog").addEventListener("click", () => {
	document.getElementById("addLocationDialog").open = false;
});

document.getElementById("confirmLocationBtn").addEventListener("click", () => {
	const lat = parseFloat(document.getElementById("newLatInput").value);
	const lng = parseFloat(document.getElementById("newLonInput").value);
	const scalerank = parseInt(document.getElementById("newScalerankInput").value) || 0;
	const type = document.getElementById("newLocTypeInput").value;
	const location = document.getElementById("newLocInput").value;
	const natlscale = parseInt(document.getElementById("newNatlscaleInput").value) || 0;
	const name = document.getElementById("newNameInput").value;

	if (dialogMode === "add") {
		if (!lat || !lng) return;
		initialData.features.push({
			type: "Feature",
			geometry: { type: "Point", coordinates: [lng, lat] },
			properties: { cartodb_id: generateUuid(), name, scalerank, type, location, natlscale },
		});
		counter.textContent = filterAndDisplay();
	} else {
		const item = initialData.features.find(
			f => String(f.properties.cartodb_id) === String(editItemId),
		);
		if (item) {
			item.geometry.coordinates = [lng, lat];
			Object.assign(item.properties, { scalerank, type, location, natlscale, name });
		}
		filterAndDisplay();
	}

	document.getElementById("addLocationDialog").open = false;
});

function openAddDialog(mode, data = {}) {
	dialogMode = mode;
	editItemId = data.id || null;
	document.getElementById("addDialogTitle").textContent =
		mode === "add" ? "Add new location" : `Edit location: ${data.name || ""}`;
	document.getElementById("confirmLocationBtn").textContent = mode === "add" ? "ADD" : "Edit";
	document.getElementById("newLatInput").value = data.lat || "";
	document.getElementById("newLonInput").value = data.lng || "";
	document.getElementById("newScalerankInput").value = data.scalerank || "";
	document.getElementById("newLocTypeInput").value = data.type || "";
	document.getElementById("newLocInput").value = data.location || "";
	document.getElementById("newNatlscaleInput").value = data.natlscale || "";
	document.getElementById("newNameInput").value = data.name || "";
	document.getElementById("addLocationDialog").open = true;
}

// ─── Context menu ─────────────────────────────────────────────────────────────
myMap.addEventListener("map-contextmenu", event => {
	infoContainer.lng = event.detail.lng;
	infoContainer.lat = event.detail.lat;
	infoContainer.addEventListener("click", e => {
		setTimeout(() => {
			const menu = document.getElementById("contextMenu");
			menu.opener = infoContainer;
			menu.open = true;
			e.stopPropagation();
		});
	}, { once: true });
	infoContainer.click();
});

document.getElementById("createLocationItem").addEventListener("click", () => {
	openAddDialog("add", { lat: infoContainer.lat, lng: infoContainer.lng });
});

document.getElementById("measureDistanceItem").addEventListener("click", () => {
	distanceMeasureStarted = true;
	measureLineStart = { lng: infoContainer.lng, lat: infoContainer.lat };
	distFromCircle.lng = infoContainer.lng;
	distFromCircle.lat = infoContainer.lat;
	distFromCircle.radius = 10;
	document.getElementById("clearDistanceItem").style.display = "";
	document.getElementById("measureDistanceItem").style.display = "none";
});

document.getElementById("clearDistanceItem").addEventListener("click", () => {
	clearDistance();
});

function clearDistance() {
	distanceMeasureStarted = false;
	measureLineStart = null;
	distFromCircle.radius = 0;
	distToCircle.radius = 0;
	distanceLine.setAttribute("width", 0);
	[...distanceLine.children].forEach(p => {
		p.lng = 0;
		p.lat = 0;
	});
	document.getElementById("distancePopover").open = false;
	document.getElementById("clearDistanceItem").style.display = "none";
	document.getElementById("measureDistanceItem").style.display = "";
}

// ─── Map click — distance measurement ────────────────────────────────────────
myMap.addEventListener("map-click", event => {
	if (!distanceMeasureStarted || !measureLineStart) return;

	const endLng = event.detail.lng;
	const endLat = event.detail.lat;

	const pts = distanceLine.querySelectorAll("ui5-geomap-point");
	if (pts[0]) { pts[0].lng = measureLineStart.lng; pts[0].lat = measureLineStart.lat; }
	if (pts[1]) { pts[1].lng = endLng; pts[1].lat = endLat; }

	distanceLine.setAttribute("color", "blue");
	distanceLine.setAttribute("width", 3);
	distanceLine.setAttribute("opacity", 0.3);

	distToCircle.lng = endLng;
	distToCircle.lat = endLat;
	distToCircle.radius = 10;

	const dist = distanceLine.getDistance ? distanceLine.getDistance() : 0;
	document.getElementById("distanceText").innerText = `Distance: ${parseFloat(dist).toFixed(2)} km`;
	genericInfoContainer.lng = endLng;
	genericInfoContainer.lat = endLat;
	const pop = document.getElementById("distancePopover");
	pop.opener = genericInfoContainer;
	pop.open = true;

	distanceMeasureStarted = false;
});

// ─── Spot menu actions ────────────────────────────────────────────────────────
document.getElementById("editSpotItem").addEventListener("click", () => {
	if (currentSpotData) openAddDialog("edit", currentSpotData);
	document.getElementById("spotMenu").open = false;
});

document.getElementById("measureToLocationItem").addEventListener("click", () => {
	if (!currentSpotData) return;
	measureLineStart = { lng: currentSpotData.lng, lat: currentSpotData.lat };
	distFromCircle.lng = currentSpotData.lng;
	distFromCircle.lat = currentSpotData.lat;
	distFromCircle.radius = 10;
	distanceMeasureStarted = true;
	document.getElementById("spotMenu").open = false;
});

// ─── Fly-to ───────────────────────────────────────────────────────────────────
document.getElementById("flyToBtn").addEventListener("click", e => {
	document.getElementById("flyToDialog").open = true;
});

document.getElementById("closeFlyToDialog").addEventListener("click", () => {
	document.getElementById("flyToDialog").open = false;
});

document.getElementById("flyToDest").addEventListener("change", e => {
	const selected = [...e.target.items].find(i => i.selected);
	const dest = selected?.getAttribute("data-ui5-coordinates");
	if (dest) {
		const [lng, lat] = dest.split(",").map(s => s.trim());
		flyToDestCoords = [lng, lat];
	}
});

document.getElementById("goToBtn").addEventListener("click", () => {
	// Read the current selection at click time — change event may not have fired yet
	// if the user picked an item and immediately clicked the button.
	const combo = document.getElementById("flyToDest");
	const selected = [...combo.items].find(i => i.selected);
	const dest = selected?.getAttribute("data-ui5-coordinates");
	if (dest) {
		const [lng, lat] = dest.split(",").map(s => s.trim());
		flyToDestCoords = [lng, lat];
	}
	const restrictedArea = restrictedBoundsArea.value;
	const polygon = GeomapGeometry.geomapPolygon(JSON.parse(restrictedArea));
	const inRestricted = GeomapGeometryUtil.isPointInPolygon(flyToDestCoords, polygon);
	const msg = document.getElementById("restrictedAreaMsg");

	if (inRestricted) {
		msg.textContent = "Selected location is in restricted area.";
		msg.style.display = "";
		setTimeout(() => { msg.style.display = "none"; }, 3000);
		return;
	}

	myMap.map.flyTo({ center: flyToDestCoords, essential: true, zoom: 9, speed: 0.2 });
	document.getElementById("flyToDialog").open = false;
});

// ─── Settings / Personalization ───────────────────────────────────────────────
document.getElementById("settingsBtn").addEventListener("click", e => {
	document.getElementById("persoDialog").open = true;
});

document.getElementById("closePersoDialog").addEventListener("click", () => {
	document.getElementById("persoDialog").open = false;
});

document.getElementById("closePersoOkBtn").addEventListener("click", () => {
	document.getElementById("persoDialog").open = false;
});

document.getElementById("outlinePicker").addEventListener("change", () => {
	selCtrl.setAttribute("outline-color", document.getElementById("outlinePicker").HEX);
});

document.getElementById("fillPicker").addEventListener("change", () => {
	selCtrl.setAttribute("fill-color", document.getElementById("fillPicker").HEX);
});

const validatorButton = document.getElementById("validatorButton");
validatorButton.addEventListener("click", () => {
	const enabled = validatorButton.getAttribute("data-mode") === "1";
	if (enabled) {
		validatorButton.textContent = "Disable Validator";
		validatorButton.setAttribute("design", "Negative");
		validatorButton.setAttribute("data-mode", "0");
		selCtrl.setValidator((feature, context) => {
			if (context.updateType === "finish" || context.updateType === "commit") {
				return GeomapGeometry.NotSelfIntersectingValidation(feature);
			}
			return true;
		});
	} else {
		validatorButton.textContent = "Enable Validator";
		validatorButton.setAttribute("design", "Positive");
		validatorButton.setAttribute("data-mode", "1");
		selCtrl.setValidator(() => true);
	}
});

// ─── Selection finish → open settings dialog ──────────────────────────────────
myMap.addEventListener("selection-finish", evt => {
	const selections = selCtrl.selections;
	document.getElementById("selectionTextArea").setAttribute(
		"value",
		JSON.stringify(selections, undefined, 4),
	);

	const geom = evt.detail.snapshot[0]?.geometry?.coordinates;
	if (geom) {
		const itemsInArea = myMap.getElementsInSelectedArea(geom);
		document.getElementById("selectionItemsTextArea").setAttribute(
			"value",
			JSON.stringify(itemsInArea, undefined, 4),
		);
	}

	document.getElementById("persoDialog").open = true;
});

// ─── Perfect Zoom ─────────────────────────────────────────────────────────────
document.getElementById("zoomBtn").addEventListener("click", () => {
	try {
		myMap.perfectZoom(JSON.parse(boundsArea.value));
	} catch (e) {
		console.warn("Invalid bounds JSON", e);
	}
});

// ─── Guide ────────────────────────────────────────────────────────────────────
document.getElementById("guideBtn").addEventListener("click", () => {
	document.getElementById("guideDialog").open = true;
});

document.getElementById("closeGuideDialog").addEventListener("click", () => {
	document.getElementById("guideDialog").open = false;
});

document.getElementById("closeGuideBtn").addEventListener("click", () => {
	document.getElementById("guideDialog").open = false;
});

// ─── ShellBar profile ─────────────────────────────────────────────────────────
document.getElementById("shellbar").addEventListener("profile-click", () => {
	document.getElementById("persoDialog").open = true;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateUuid() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
	});
}
