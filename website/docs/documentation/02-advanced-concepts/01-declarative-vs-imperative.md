# Assessment of Declarative Features

## Benefits

### 1. Encapsulation of JavaScript and CSS Needed for Creating a Map

- We ship and load both
- The user places the tag where the map must be placed

```html
<head>
    <script src="https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.js"></script>
    <link href="https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.css" rel="stylesheet"/>
</head>
<body>
    <div id="map"></div>
    
    <script>
        var map = new maplibregl.Map({
			container: 'map', // container id
		});
    </script>
</body>
```

vs

```html

<head>
    <script type="module" src="../bundle.esm.js"></script>
</head>
<body>
<ui5-geomap></ui5-geomap>
</body>
```

### 2. Slotting of User-Defined Content

- The user passes the content that needs to be placed on the map as part of the same HTML tree

```html
<script>
    var el = document.createElement("div");
    el.classList.add("circle"); // etc..
	var marker = new maplibregl.Marker({
        el: el
    }).setLngLat([8.6, 51.00])
            .addTo(map);
    
</script>
```

vs

```html
	<ui5-geomap-container lat="51.00" lng="8.6">
		<div class="circle" style="background: red; width: 50px; height: 50px;">15%</div>
	</ui5-geomap-container>
```

### 3. Lifecycle Synchronization

- The map's `load` event is implicitly awaited before it triggers the lifecycle of map objects (such as sources, layers, markers, etc.)

```html
<ui5-geomap>
    <ui5-geomap-source geojson-url="./data.json"></ui5-geomap-source>
    <ui5-geomap-fill-layer></ui5-geomap-fill-layer>
</ui5-geomap>
```

vs

```js
var map = new maplibregl.Map({
	container: 'map', // container id
});

map.on("load", () => {
	
    map.addSource('data', {
        'type': 'geojson',
        'url': './data.json'
    });

    map.addLayer({
        type: "fill"
    }); // etc...
});
```


### 4. Declarative Binding of Layers and Sources

- By the HTML `id` attribute

```html
<ui5-geomap-source id="states" geojson-url="states.json"></ui5-geomap-source>
<ui5-geomap-fill-layer id="layer" source="states" fill-color="blue" opacity="0.5"></ui5-geomap-fill-layer>
```

vs

```js
map.on("load", () => {

	map.addSource('states', {
		'type': 'geojson',
		'url': './states.json'
	});

	map.addLayer({
		type: "fill",
		source: "states",
		paint: {
			"fill-color": "blue",
			"opacity": 0.5,
		},
	});
});
```

### 5. Same API for First-Time Setting and Updating of Paint/Layout Properties

- Set on the layer directly, not on the map
- Same API for first-time and subsequent setting
- ID not needed in order to access a layer, the layer object itself is used for a reference
- No separate APIs for paint/layout properties, the user does not need to distinguish between the two
- Some APIs can be renamed. Example: `visibility: none|visible` -> `hidden: true|false` or `circle-radius` -> `radius`

```js
map.addLayer({
        id: "myLayer",
		type: "fill",
		source: "states",
		paint: {
			"fill-color": "blue",
		},
        layout: {
        	"visibility": "none",
        }
	});

// Later
map.setPaintProperty("myLayer", "fill-color", "green");
map.setLayoutProperty("myLayer", "visibility", "visible");
```

vs

```js
const layer = document.createElement("ui5-geomap-fill-layer");
layer.source = "states";
layer.fillColor = "blue";
layer.hidden = true;

// Later
layer.fillColor = "green";
layer.hidden = false;
```

### 6. Complex vs Simple Property Values

- `maplibre` is always imperative and can set complex values initially, `<ui5-geomap>` only imperatively
- If `ui5-geomap` is used with frameworks that can bind properties (not only attributes), the effort is equivalent

```js
map.addLayer({
		type: "fill",
		source: "states",
		paint: {
			"fill-color": [
				'interpolate',
				['linear'],
				['get', 'population'],
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
			]
		},
	});
```

vs

```html
<ui5-geomap-fill-layer id="layer" source="states"></ui5-geomap-fill-layer>
<script>
    document.getElementById("layer").fillColor = [
		'interpolate',
		['linear'],
		['get', 'population'],
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
</script>
```

or

```js
const layer = document.createElement("ui5-geomap-fill-layer");
layer.source = "states";
layer.fillColor = [
	'interpolate',
	['linear'],
	['get', 'population'],
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
```

With imperative APIs, the effort is equivalent.

### 7. Cluster Sources Simplified

- In `maplibre` the `source` class can have a `cluster: true` property to enable clustering
- `80%` of the public API of `maplibre`s `source` class is clustering-related, while `ui5-geomap` offers a special clustering class and offloads the basic source class
- `ui5-geomap` layers offer a `displayed-features` property (built-in `filter` for the most commonly used filter in clustering: `["!", ["has", "point_count"]]` vs `["has", "point_count"]`)

```js
map.addSource('data1', {
    type: 'geojson',
    data: 'data1.geojson.json',
    cluster: true,
    clusterMinPoints: 2,
    clusterRadius: 50
});
 
map.addLayer({
    id: 'points_unclustered',
    type: 'circle',
    source: 'data1',
    filter: ['!', ['has', 'point_count']],
    paint: {
        'circle-radius': 20,
        'fill-color': 'green'
    }
});

map.addLayer({
	id: 'points_clustered',
	type: 'circle',
	source: 'data1',
	filter: ['has', 'point_count'],
	paint: {
		'circle-radius': 30,
		'fill-color': 'blue'
	}
});
```

vs

```html
<ui5-geomap-cluster-source id="data1" geojson-url="./data1.geojson.json" cluster-min-points="2" cluster-radius="50"></ui5-geomap-cluster-source>
<ui5-geomap-circle-layer id="points_unclustered" source="data1" displayed-features="NotClustered" radius="20" fill-color="green"></ui5-geomap-circle-layer>
<ui5-geomap-circle-layer id="points_clustered" source="data1" displayed-features="Clustered" fill-color="blue" radius="30"></ui5-geomap-circle-layer>
```

## See Also

- [Declarative API: Limitations and Performance](./02-declarative-limitations.md) — where the declarative API stops scaling and when to reach for the imperative paths
