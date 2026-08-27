import "@ui5/webcomponents-geomap/dist/Geomap.js";
import "@ui5/webcomponents-geomap/dist/GeomapProvider.js";
import "@ui5/webcomponents-geomap/dist/GeomapNavigationControl.js";
import "@ui5/webcomponents-geomap/dist/GeomapSource.js";
import "@ui5/webcomponents-geomap/dist/GeomapLineLayer.js";
import "@ui5/webcomponents-geomap/dist/GeomapFillLayer.js";

import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/SuggestionItem.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents-icons/dist/search.js";

const map = document.getElementById("map");
const info = document.getElementById("info");
const fly = document.getElementById("fly");
const search = document.getElementById("search");

map.addEventListener("map-zoom", event => {
	fly.textContent = event.detail.zoom >= 6.5 ? "Zoom out" : "Zoom in";
});

fly.addEventListener("click", () => {
	const lng = parseFloat(fly.getAttribute("data-lng"));
	const lat = parseFloat(fly.getAttribute("data-lat"));
	if (map.zoom >= 6.5) {
		map.flyTo(-87.7292790540713, 36.79873532444539, 3);
	} else {
		map.flyTo(lng, lat, 6.5);
	}

	info.open = false;
});

(async () => {
	// backuped in local `us_states.geojson`
	const states = await (await fetch("https://docs.mapbox.com/mapbox-gl-js/assets/us_states.geojson")).json();

	states.features.forEach(feature => {
		// Source
		const sourceId = `state_${feature.properties.STATE_ID}`;
		const source = document.createElement("ui5-geomap-source");
		source.id = sourceId;
		source.geojson = feature;
		map.appendChild(source);

		// Line layer
		const line = document.createElement("ui5-geomap-line-layer");
		line.id = `line${feature.properties.STATE_ID}`;
		line.source = sourceId;
		line.color = "blue";
		line.width = 1;
		line.opacity = 0.3;
		map.appendChild(line);

		// Fill layer
		const fill = document.createElement("ui5-geomap-fill-layer");
		fill.id = `fill${feature.properties.STATE_ID}`;
		fill.source = sourceId;
		fill.fillColor = "blue";
		fill.opacity = 0.3;
		map.appendChild(fill);

		fill.addEventListener("layer-mouseenter", () => {
			fill.fillColor = "green";
		});
		fill.addEventListener("layer-mouseleave", () => {
			fill.fillColor = "blue";
		});
		fill.addEventListener("layer-click", event => {
			fly.setAttribute("data-lng", event.detail.lng);
			fly.setAttribute("data-lat", event.detail.lat);
			info.querySelector(".description").innerHTML = feature.properties.STATE_NAME;
			info.opener = event.detail.dom;
			info.open = true;
		});

		// Suggestion item
		const suggestion = document.createElement("ui5-suggestion-item");
		suggestion.id = feature.properties.STATE_ID;
		suggestion.icon = "world";
		suggestion.info = "explore";
		suggestion.infoState = "Success";
		suggestion.text = feature.properties.STATE_NAME;
		search.appendChild(suggestion);
	});

	search.addEventListener("input", () => {
		if (search.value === "") {
			map.flyTo(-87.7292790540713, 36.79873532444539, 3);
		}

		search.suggestionItems.forEach(child => {
			search.removeChild(child);
		});

		states.features.forEach(state => {
			const id = state.properties.STATE_ID;
			const name = state.properties.STATE_NAME;

			document.getElementById(`fill${id}`).fillColor = "blue";

			if (!name.toLowerCase().includes(search.value.toLowerCase())) {
				document.getElementById(`fill${id}`).opacity = 0.08;
				document.getElementById(`line${id}`).opacity = 0.08;
				return;
			}

			const suggestion = document.createElement("ui5-suggestion-item");
			suggestion.id = id;
			suggestion.icon = "world";
			suggestion.info = "explore";
			suggestion.infoState = "Success";
			suggestion.text = name;
			suggestion.data = state.geometry;
			search.appendChild(suggestion);

			document.getElementById(`fill${id}`).opacity = 0.3;
			document.getElementById(`line${id}`).opacity = 0.3;
		});
	});

	search.addEventListener("suggestion-item-select", event => {
		const stateId = event.detail.item.id;
		const stateInfo = states.features.find(state => state.properties.STATE_ID === stateId);
		const stateCenter = window.geometry.geomapCentroid(stateInfo); // TODO: ... think what to do with geometry
		const coords = stateCenter.geometry.coordinates;
		map.flyTo(coords[0], coords[1], 6.5);
	});

	search.addEventListener("suggestion-item-preview", event => {
		const stateId = event.detail.item.id;
		states.features.forEach(state => {
			const id = state.properties.STATE_ID;
			document.getElementById(`fill${id}`).fillColor = id === stateId ? "green" : "blue";
		});
	});

	search.addEventListener("change", event => {
		let stateInfo;

		if (search.suggestionItems.length === 1) {
			const stateId = search.suggestionItems[0].id;
			stateInfo = states.features.find(state => state.properties.STATE_ID === stateId);
		} else {
			const name = search.value;
			stateInfo = states.features.find(state => state.properties.STATE_NAME.toLowerCase() === name.toLowerCase());
		}
		if (!stateInfo) {
			return;
		}

		// const stateCenter = turf.centroid(stateInfo);
		const stateCenter = window.geometry.geomapCentroid(stateInfo);
		const coords = stateCenter.geometry.coordinates;
		map.flyTo(coords[0], coords[1], 6.5);
	});

	search.focus();
})();
