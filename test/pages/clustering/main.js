import geoJson from './data1.geojson.json?url'; //?raw => as string
document.getElementById("data1").setAttribute("geojson-url", geoJson);

const map = document.getElementById("map");
const points_unclustered = document.getElementById("points_unclustered");
const points_clustered = document.getElementById("points_clustered");
const points_clustered_labels = document.getElementById("points_clustered_labels");
const popover = document.getElementById("info");
const zoom = document.getElementById("zoom");


points_clustered_labels.textFont = ["Arial Unicode MS Regular"];
points_clustered_labels.text = ['get', 'point_count'];
points_clustered_labels.textSize = [
	'step',
	['get', 'point_count'],
	16,
	3,
	18,
	5,
	20
];

points_clustered.radius = [
	'step',
	['get', 'point_count'],
	30,
	3,
	40,
	5,
	50
];

let clickedCluster;

points_clustered.addEventListener("layer-click", async event => {
	clickedCluster = event.detail.cluster;
	const leaves = await clickedCluster.getLeaves();
	const children = await clickedCluster.getChildren();

	console.log("Leaves: ", leaves);
	console.log("Children: ", children);

	[...info.querySelector("ui5-list#leaves").children].forEach(child => child.parentElement.removeChild(child));
	leaves.forEach(feature => {
		const li = document.createElement("ui5-li");
		li.textContent = `${feature.properties.STORES_PROFIT} EUR`;
		info.querySelector("ui5-list#leaves").appendChild(li);
	});

	info.opener = event.detail.dom;
	info.open = true;
});

zoom.addEventListener("click", async () => {
	if (clickedCluster) {
		info.open = false;
		await clickedCluster.expand();
	}
});