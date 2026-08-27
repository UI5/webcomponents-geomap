const map = document.getElementById("map");
const list = document.getElementById("list");

map.addEventListener("map-click", event => {
	console.log("Clicked at: ", `lng="${event.detail.lng}" lat="${event.detail.lat}"`);
});

[...document.querySelectorAll(".opens-popup")].forEach(el => {
	el.addEventListener("click", event => {
		document.getElementById("info").opener = el;
		document.getElementById("info").open = true;
		event.stopPropagation();
	});
});

[...document.querySelectorAll(".clickable-layer")].forEach(el => {
	el.addEventListener("layer-click", event => {
		console.log(`Layer clicked at ${event.detail.lng}, ${event.detail.lat} / ${event.detail.x}px, ${event.detail.y}px`);
		document.getElementById("info").opener = event.detail.dom;
		document.getElementById("info").open = true;
	});
});

list.addEventListener("item-click", event => {
	const type = event.detail.item.id;
	let selector;
	let description;

	if (type === "html") {
		selector = ".html-circle";
		description = "This is an HTML-based circle";
	} else if (type === "geo") {
		selector = "ui5-geomap-geocircle";
		description = "This is a Geo Circle";
	} else {
		selector = "ui5-geomap-circle";
		description = "This is a circle";
	}

	[...document.querySelectorAll(selector)].forEach(item => {
		// Help popover
		const popover = document.createElement("ui5-popover");
		const label = document.createElement("ui5-label");
		label.textContent = description;
		popover.appendChild(label);
		document.body.appendChild(popover);

		// Anchor for the popover
		const cont = document.createElement("ui5-geomap-container");
		cont.lng = item.lng;
		cont.lat = item.lat;
		map.appendChild(cont);

		// Open / close the popover
		popover.opener = cont;
		popover.open = true;
		setTimeout(() => {
			popover.close();
			document.body.removeChild(popover);
			map.removeChild(cont);
		}, 3000);
	});
});