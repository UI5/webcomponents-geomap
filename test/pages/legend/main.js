import populationItems from './population-items.json';
import statusItems from './status-items.json';

// Set legend items
const legendPopulation = document.getElementById("legendPopulation");
const legendStatus = document.getElementById("legendStatus");

legendPopulation.items = populationItems;
legendStatus.items = statusItems;

// Listen for toggle events
legendPopulation.addEventListener("toggle", (e) => {
	console.log("Population legend toggled:", e.detail);
});

function clearAllGreying() {
	document.querySelectorAll("ui5-geomap-container").forEach(el => {
		el.style.opacity = "";
		el.style.filter = "";
		el.style.transition = "";
	});
}

function greyOut(el) {
	el.style.opacity = "0.35";
	el.style.filter = "grayscale(1)";
	el.style.transition = "opacity 0.25s ease, filter 0.25s ease";
}

let activePopFilter = null;

legendPopulation.addEventListener("item-click", (e) => {
	const item = e.detail.item;

	if (activePopFilter === item.id) {
		activePopFilter = null;
		clearAllGreying();
		return;
	}

	activePopFilter = item.id;
	document.querySelectorAll("ui5-geomap-container").forEach(container => {
		const inner = container.querySelector("[data-population]");
		const level = inner ? inner.dataset.population : null;
		if (level === item.id) {
			container.style.opacity = "";
			container.style.filter = "";
			container.style.transition = "";
		} else {
			greyOut(container);
		}
	});
});

legendStatus.addEventListener("toggle", (e) => {
	console.log("Status legend toggled:", e.detail);
});

legendStatus.addEventListener("item-click", (e) => {
	const item = e.detail.item;
	alert(`Legend item clicked!\n\nID: ${item.id}\nLabel: ${item.label}\nColor: ${item.color}\nIcon: ${item.icon || "none"}`);
});

// Toggle buttons to show/hide legends
const showPopulationBtn = document.getElementById("showPopulationLegend");
const showStatusBtn = document.getElementById("showStatusLegend");

showPopulationBtn.addEventListener("click", () => {
	legendPopulation.hidden = !legendPopulation.hidden;
	showPopulationBtn.textContent = legendPopulation.hidden ? "Show Population Legend" : "Hide Population Legend";
});

showStatusBtn.addEventListener("click", () => {
	legendStatus.hidden = !legendStatus.hidden;
	showStatusBtn.textContent = legendStatus.hidden ? "Show Status Legend" : "Hide Status Legend";
});

// City circle click → popover
const cityData = {
	Paris: "11,000,000",
	London: "9,000,000",
	Madrid: "6,700,000",
	Barcelona: "5,600,000",
	Rome: "4,300,000",
	Berlin: "3,700,000",
	Milan: "3,100,000",
	Amsterdam: "2,500,000",
	Vienna: "1,900,000",
	Hamburg: "1,900,000",
	Warsaw: "1,800,000",
	Munich: "1,500,000",
};

document.getElementById("map").addEventListener("click", (e) => {
	const circle = e.target.closest(".city-circle");
	if (!circle) return;

	e.stopPropagation();

	const name = circle.textContent.trim();
	const pop = cityData[name] || "N/A";

	document.getElementById("cityInfoName").textContent = name;
	document.getElementById("cityInfoPop").textContent = `Metro population: ${pop}`;

	const popover = document.getElementById("cityInfo");
	popover.opener = circle;
	popover.open = true;
});
