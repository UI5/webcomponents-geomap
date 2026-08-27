import "@ui5/webcomponents/dist/Button.js";

const btn = document.getElementById("openApp");
const location = "https://pages.github.com/I558285/ui5-geomap-sampleApp/";
btn.addEventListener("click", () => {
	window.open(location, "_blank");
});
