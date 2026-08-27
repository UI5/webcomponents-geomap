import type { IControl, Map } from "../../MapLibre.js";

type CopyrightControlOptions = {
	slotName: string;
}
class GeomapCopyrightControlWrapper implements IControl {
	_map?: Map;
	_container!: HTMLDivElement;
	_slot: HTMLSlotElement;

	constructor(options: CopyrightControlOptions) {
		this._slot = document.createElement("slot");
		this._slot.name = options.slotName;
	}

	onAdd(map: Map) {
		this._map = map;
		this._container = document.createElement("div");
		this._container.appendChild(this._slot);
		this._container.className = "maplibregl-ctrl";

		return this._container;
	}

	onRemove() {
		this._container.parentElement?.removeChild(this._container);
		this._map = undefined;
	}

	setSlotName(slotName: string) {
		this._slot.name = slotName;
	}
}

export { CopyrightControlOptions };
export default GeomapCopyrightControlWrapper;
