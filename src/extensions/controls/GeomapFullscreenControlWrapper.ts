import ToggleButton from "@ui5/webcomponents/dist/ToggleButton.js";

import type { FullscreenControlOptions } from "../../MapLibre.js";
import { FullscreenControl } from "../../MapLibre.js";

import "@ui5/webcomponents-icons/dist/full-screen.js";
import "@ui5/webcomponents-icons/dist/exit-full-screen.js";

class GeomapFullscreenControlWrapper extends FullscreenControl {
	options: FullscreenControlOptions;

	constructor(options: FullscreenControlOptions = {}) {
		super(options);
		this.options = options;
	}

	_setupUI() {
		this._fullscreenButton = new ToggleButton() as unknown as HTMLButtonElement;
		this._fullscreenButton.className = "maplibregl-ctrl-fullscreen";
		this._fullscreenButton.setAttribute("icon", "full-screen");
		this._controlContainer.appendChild(this._fullscreenButton);
		this._controlContainer.classList.remove("maplibregl-ctrl-group");
		this._updateTitle();
		this._fullscreenButton.addEventListener("click", this._onClickFullscreen);
		this._fullscreenButton.addEventListener("click", this._changeIcon);
		window.document.addEventListener(this._fullscreenchange, this._onFullscreenChange);
	}

	/**
	 * Override to handle iPhone where Fullscreen API exists but silently fails
	 * for non-video elements. Uses CSS-based pseudo-fullscreen instead.
	 */
	_requestFullscreen() {
		const isIPhone = /iPhone/i.test(navigator.userAgent);
		if (isIPhone) {
			this._togglePseudoFullScreen();
		} else {
			super._requestFullscreen();
		}
	}

	/**
	 * Override to handle exiting from CSS-based pseudo-fullscreen mode.
	 */
	_exitFullscreen() {
		if (this._container.classList.contains("maplibregl-pseudo-fullscreen")) {
			this._togglePseudoFullScreen();
		} else {
			super._exitFullscreen();
		}
	}

	_changeIcon = () => {
		const icon = this._fullscreenButton.getAttribute("icon");
		this._fullscreenButton.setAttribute("icon", icon === "full-screen" ? "exit-full-screen" : "full-screen");
	}

	_updateTitle() {
		const title = this._getTitle();
		this._fullscreenButton.setAttribute("accessible-name", title);
		this._fullscreenButton.setAttribute("tooltip", title);
	}
}

export { FullscreenControlOptions };
export default GeomapFullscreenControlWrapper;
