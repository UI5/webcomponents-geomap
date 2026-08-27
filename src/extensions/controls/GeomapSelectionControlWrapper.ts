import type { IControl, Map } from "../../MapLibre.js";
import GeomapSelectionControlComponent from "../../GeomapSelectionControlComponent.js";
import type { SelectionFinishEventDetail, SelectionItemEventDetail } from "../../GeomapSelectionControlComponent.js";

type SelectionControlOptions = {
	selectionType: string,
	selectionFinishCallback: SelectionFinishEventCallback,
	selectionItemCallback: SelectionItemEventCallback,
}

type SelectionFinishEventCallback = (e: CustomEvent<SelectionFinishEventDetail>) => void;
type SelectionItemEventCallback = (e: CustomEvent<SelectionItemEventDetail>) => void;

class GeomapSelectionControlWrapper implements IControl {
	options: SelectionControlOptions;
	_map?: Map;
	_container!: GeomapSelectionControlComponent;

	constructor(options: SelectionControlOptions) {
		this.options = options;
	}

	onAdd(map: Map) {
		this._map = map;
		this._container = new GeomapSelectionControlComponent();
		this._container.map = map;
		this._container.className = "maplibregl-ctrl";

		this._container.addEventListener("selection-finish", this.options.selectionFinishCallback as EventListener);
		this._container.addEventListener("selection-item", this.options.selectionItemCallback as EventListener);

		// pass the attributes to the control
		this._container.setAttribute("selection-type", this.options.selectionType);

		this._container.updateAllSelectionStyles(this.options);
		return this._container;
	}

	setModeStyles(mode: string, styles: any) {
		if (!this._container || !this._container._terraDraw) {
			return;
		}
		this._container._terraDraw.setModeStyles(mode, styles);
	}

	onRemove() {
		this._container.parentElement?.removeChild(this._container);
		this._container.removeEventListener("selection-finish", this.options.selectionFinishCallback as EventListener);
		this._container.removeEventListener("selection-item", this.options.selectionItemCallback as EventListener);
		this._map = undefined;
	}
}

export {
	SelectionControlOptions,
	SelectionFinishEventCallback,
	SelectionItemEventCallback,
};
export default GeomapSelectionControlWrapper;
