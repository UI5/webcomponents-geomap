import type { IControl, Map } from "../../MapLibre.js";

type ContainerControlOptions = {
	slotName: string;
}
class GeomapContainerControlWrapper implements IControl {
	_map?: Map;
	_container!: HTMLDivElement;
	_slot: HTMLSlotElement;

	constructor(options: ContainerControlOptions) {
		this._slot = document.createElement("slot");
		this._slot.name = options.slotName;
	}

	onAdd(map: Map) {
		this._map = map;
		this._container = document.createElement("div");
		this._container.className = "maplibregl-ctrl";
		this._container.appendChild(this._slot);

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

export { ContainerControlOptions };
export default GeomapContainerControlWrapper;
