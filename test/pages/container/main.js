import cityData from './city-data.json';
import legendItems from './legend-items.json';

const balloonIds = [
	"balloonParis", "balloonBerlin", "balloonLondon",
	"balloonMadrid", "balloonVienna", "balloonMilan", "balloonWarsaw", "balloonPrague",
];

const legendAqi = document.getElementById("legendAqi");
legendAqi.items = legendItems;

let activeFilter = null;

legendAqi.addEventListener("item-click", (e) => {
	const item = e.detail.item;

	if (activeFilter === item.id) {
		activeFilter = null;
		document.querySelectorAll("ui5-geomap-container").forEach(container => {
			container.style.opacity = "";
			container.style.filter = "";
			container.style.transition = "";
		});
		return;
	}

	activeFilter = item.id;
	document.querySelectorAll("ui5-geomap-container").forEach(container => {
		const inner = container.querySelector("[data-aqi-level]");
		const level = inner ? inner.dataset.aqiLevel : null;
		if (level === item.id) {
			container.style.opacity = "";
			container.style.filter = "";
			container.style.transition = "";
		} else {
			container.style.opacity = "0.35";
			container.style.filter = "grayscale(1)";
			container.style.transition = "opacity 0.25s ease, filter 0.25s ease";
		}
	});
});

document.getElementById("btnToggleBadges")?.addEventListener("click", () => {
	balloonIds.forEach(id => {
		const el = document.getElementById(id);
		if (el) {
			el.style.display = el.style.display === "none" ? "" : "none";
		}
	});
});

document.querySelectorAll(".comic-balloon, .chart-container").forEach(balloon => {
	balloon.addEventListener("click", () => {
		const city = balloon.dataset.city;
		const data = cityData[city];
		if (!data) return;

		const popover = document.getElementById("cityPopover");
		document.getElementById("popoverCity").textContent = city;
		document.getElementById("popoverAqi").textContent = `AQI ${data.aqi} — ${data.status}`;
		document.getElementById("popoverAqi").style.color = data.color;
		document.getElementById("popoverInfo").textContent = data.detail;
		popover.opener = balloon;
		popover.open = true;
	});
});

// Prevent map from capturing pointer events on the form balloon
const formBalloon = document.querySelector(".form-balloon");
if (formBalloon) {
	["mousedown", "pointerdown", "touchstart", "click", "dblclick"].forEach((evt) => {
		formBalloon.addEventListener(evt, (e) => e.stopPropagation());
	});
}

const issueSubmit = document.getElementById("issueSubmit");
if (issueSubmit) {
	issueSubmit.addEventListener("click", () => {
		const input = document.getElementById("issueInput");
		if (input?.value) {
			alert(`AQI incident reported for Brussels: "${input.value}"`);
			input.value = "";
		}
	});
}
