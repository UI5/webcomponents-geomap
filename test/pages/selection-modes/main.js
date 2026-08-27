const selCtrl = document.getElementById("selCtrl");
const currentModes = document.getElementById("currentModes");

const buttons = {
	btnAll: { modes: [], label: "[] (all)" },
	btnRectOnly: { modes: ["rectangle"], label: '["rectangle"]' },
	btnPolySelect: { modes: ["polygon", "select"], label: '["polygon", "select"]' },
	btnDrawingOnly: { modes: ["freehand", "polygon", "rectangle", "circle"], label: '["freehand", "polygon", "rectangle", "circle"]' },
	btnSelectOnly: { modes: ["select"], label: '["select"]' },
};

const setActive = activeId => {
	Object.keys(buttons).forEach(id => {
		document.getElementById(id).setAttribute("design", id === activeId ? "Emphasized" : "Default");
	});
};

Object.entries(buttons).forEach(([id, { modes, label }]) => {
	document.getElementById(id).addEventListener("click", () => {
		selCtrl.modes = modes;
		currentModes.textContent = label;
		setActive(id);
	});
});
