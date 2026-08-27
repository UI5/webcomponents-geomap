const myMap = document.getElementById("myMap");

myMap.addEventListener("map-load", () => {
	const map = myMap.map; // maplibre object

	map.getCanvas().style.cursor = 'default';
	map.getCanvas().style.cursor = 'default';
	var layers = ['-30 hab./km', '30-50 hab./km', '50-100 hab./km', '100-500 hab./km', '500-1000 hab./km', '+1000 hab./km'];
	var colors = ['#4d9221', '#a1d76a', '#e6f5d0', '#fde0ef', '#e9a3c9', '#c51b7d'];

	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i] + "";
		var color = colors[i];
		var item = document.createElement('div');
		var key = document.createElement('span');
		key.className = 'legend-key';
		key.style.backgroundColor = color;
		var value = document.createElement('span');
		value.innerHTML = layer;
		item.appendChild(key);
		item.appendChild(value);
		legend.appendChild(item);
	}

	// Add data
	map.addSource('Municipalities', {
		type: 'geojson',
		data: 'https://raw.githubusercontent.com/mastersigat/data/main/communesBZH.geojson'
	});


	// Municipalities layer
	map.addLayer({
		'id': 'Municipalities',
		'type': 'fill',
		'source': 'Municipalities',
		'layout': {'visibility': 'visible'},
		'paint': {'fill-outline-color': '#000000',
			'fill-color': ['interpolate',['linear'],
				['get', 'density'],
				30, '#4d9221',
				50, '#a1d76a',
				100, '#e6f5d0',
				200, '#fde0ef',
				400, '#e9a3c9',
				800, '#c51b7d'],
			'fill-opacity': 0.75}
	});


	// Add Departments
	map.addSource('lignes', {
		type: 'geojson',
		data: 'https://raw.githubusercontent.com/mastersigat/data/main/Departements.geojson'
	});

	map.addLayer({
		'id': 'Lignes',
		'type': 'line',
		'source': 'lignes',
		'paint': {'line-width': 2.5,
			'line-color': '#111111'}
	});

	// Configuration PopUp
	map.on('mousemove', function (e) {
		var states = map.queryRenderedFeatures(e.point, {
			layers: ['Municipalities']
		});
		if (states.length > 0) {
			document.getElementById('pd').innerHTML = "<h3><strong>" + states[0].properties.NOM_COM_M
				+ "</strong></h3><p><strong><em>" + states[0].properties.density + "</strong> hab./km2</em></p>"
				+ "</strong></h3><p><strong><em>" + states[0].properties.POPULATION + "</strong> habitants </p>";
		} else {
			document.getElementById('pd').innerHTML = '<p>Data : INSEE 2018 / OSM</p>';
		}
	});
});