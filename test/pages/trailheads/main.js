const myMap = document.getElementById("myMap");

myMap.addEventListener("map-load", () => {
	const map = myMap.map; // maplibre object
	setTimeout(() => {
		map.addLayer({
			id: "trailheads-circle",
			type: "circle",
			source: "trailheads",
			paint: {
				"circle-color": "hsla(0,0%,0%,0.75)",
				"circle-stroke-width": 1.5,
				"circle-stroke-color": "white",
			}
		});

		map.addLayer({
			id: "trailheads-cluster-count",
			type: "symbol",
			source: "trailheads",
			layout: {
				"text-font": ["Arial Bold"],
				"text-field": ["get", "point_count"],
				"text-offset": [0, 0.1] // move the label vertically downwards slightly to improve centering
			},
			paint: {
				"text-color": "white"
			}
		});
	});
});