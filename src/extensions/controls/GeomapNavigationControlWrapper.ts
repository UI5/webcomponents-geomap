import type { IControl, Map } from "../../MapLibre.js";
import GeomapNavigationControlComponent from "../../GeomapNavigationControlComponent.js";

type NavigationControlOptions = {
	noCompass?: boolean;
	noZoom?: boolean;
	visualizePitch?: boolean;
}

class GeomapNavigationControlWrapper implements IControl {
	options: NavigationControlOptions;
	_map?: Map;
	_container!: GeomapNavigationControlComponent;

	constructor(options: NavigationControlOptions = {}) {
		this.options = options;
	}

	onAdd(map: Map) {
		this._map = map;
		this._container = new GeomapNavigationControlComponent();
		this._container.className = "maplibregl-ctrl";

		if (this.options.noZoom) {
			this._container.setAttribute("no-zoom", "");
		}

		if (this.options.noCompass) {
			this._container.setAttribute("no-compass", "");
		}

		this._container.addEventListener("zoom-in", () => this._map?.zoomIn());
		this._container.addEventListener("zoom-out", () => this._map?.zoomOut());
		this._container.addEventListener("compass-click", () => {
			if (this.options.visualizePitch) {
				this._map?.resetNorthPitch();
			} else {
				this._map?.resetNorth();
			}
		});

		this._map.on("pitch", this._rotateCompassArrow);
		this._map.on("rotate", this._rotateCompassArrow);
		this._rotateCompassArrow();

		return this._container;
	}

	onRemove() {
		this._container.parentElement?.removeChild(this._container);
		this._map?.off("rotate", this._rotateCompassArrow);
		this._map?.off("pitch", this._rotateCompassArrow);
		this._map = undefined;
	}

	setNoZoom(noZoom: boolean) {
		this.options.noZoom = noZoom;

		if (noZoom) {
			this._container.setAttribute("no-zoom", "");
		} else {
			this._container.removeAttribute("no-zoom");
		}
	}

	setNoCompass(noCompass: boolean) {
		this.options.noCompass = noCompass;

		if (noCompass) {
			this._container.setAttribute("no-compass", "");
		} else {
			this._container.removeAttribute("no-compass");
		}
	}

	_rotateCompassArrow = () => {
		if (!this._map || !this.options.visualizePitch) {
			return;
		}

		const rotate = this.options.visualizePitch
			? `scale(${1 / Math.cos(this._map.transform.pitch * (Math.PI / 180)) ** 0.5}) rotateX(${this._map.transform.pitch}deg) rotateZ(${this._map.transform.bearing * (180 / Math.PI)}deg)`
			: `rotate(${this._map.transform.bearing * (180 / Math.PI)}deg)`;

		this._container._setCSSParams(rotate);
	};
}

export { NavigationControlOptions };
export default GeomapNavigationControlWrapper;
