const map = document.getElementById("map");
const preview = document.getElementById("preview");
const previewSection = document.getElementById("preview-section");
const download = document.getElementById("download");

let lastObjectUrl = null;

document.getElementById("btnScreenshot").addEventListener("click", async () => {
	const dataUrl = await map.takeScreenshot();

	preview.src = dataUrl;
	previewSection.hidden = false;

	if (lastObjectUrl) {
		URL.revokeObjectURL(lastObjectUrl);
	}

	const blob = await (await fetch(dataUrl)).blob();
	lastObjectUrl = URL.createObjectURL(blob);
	download.href = lastObjectUrl;
	download.hidden = false;
});
