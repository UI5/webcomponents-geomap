// used in test pages
import { renderFinished } from "@ui5/webcomponents-base/dist/Render.js";

import { getAnimationMode } from "@ui5/webcomponents-base/dist/config/AnimationMode.js";
import { getLanguage } from "@ui5/webcomponents-base/dist/config/Language.js";
import { getCalendarType } from "@ui5/webcomponents-base/dist/config/CalendarType.js";
import { getTheme, setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { getNoConflict, setNoConflict } from "@ui5/webcomponents-base/dist/config/NoConflict.js";
import { getFirstDayOfWeek } from "@ui5/webcomponents-base/dist/config/FormatSettings.js";

// Enable additional themes and i18n texts
import "./dist/Assets.js";

import "@ui5/webcomponents/dist/Button.js";
import "@ui5/webcomponents/dist/Title.js";
import "@ui5/webcomponents/dist/Link.js";
import "@ui5/webcomponents/dist/CheckBox.js";
import "@ui5/webcomponents/dist/Card.js";
import "@ui5/webcomponents/dist/CardHeader.js";
import "@ui5/webcomponents/dist/Popover.js";
import "@ui5/webcomponents/dist/List.js";
import "@ui5/webcomponents/dist/ListItemStandard.js";
import "@ui5/webcomponents/dist/Icon.js";
import "@ui5/webcomponents/dist/SegmentedButton.js";
import "@ui5/webcomponents/dist/ToggleButton.js";
import "@ui5/webcomponents/dist/Slider.js";
import "@ui5/webcomponents/dist/Input.js";
import "@ui5/webcomponents/dist/TextArea.js";
import "@ui5/webcomponents/dist/Tab.js";
import "@ui5/webcomponents/dist/Label.js";
import "@ui5/webcomponents/dist/TabContainer.js";
import "@ui5/webcomponents/dist/ColorPicker.js";
import "@ui5/webcomponents/dist/features/InputSuggestions.js";
import "@ui5/webcomponents/dist/SuggestionItem.js";
import "@ui5/webcomponents/dist/StepInput.js";
import "@ui5/webcomponents/dist/Toast.js";
import "@ui5/webcomponents/dist/MessageStrip.js";
import "@ui5/webcomponents/dist/Menu.js";

import "@ui5/webcomponents-icons/dist/flight.js";
import "@ui5/webcomponents-icons/dist/alert.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/play.js";
import "@ui5/webcomponents-icons/dist/draw-rectangle.js";
import "@ui5/webcomponents-icons/dist/map.js";
import "@ui5/webcomponents-icons/dist/map-fill.js";
import "@ui5/webcomponents-icons/dist/circle-task.js";
import "@ui5/webcomponents-icons/dist/crossed-line-chart.js";
import "@ui5/webcomponents-icons/dist/cancel-share.js";
import "@ui5/webcomponents-icons/dist/cursor-arrow.js";
import "@ui5/webcomponents-icons/dist/message-information.js";
import "@ui5/webcomponents-icons/dist/home.js";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/world.js";
import "@ui5/webcomponents-icons/dist/arobase.js";
import "@ui5/webcomponents-icons/dist/journey-arrive.js";
import "@ui5/webcomponents-icons-business-suite/dist/map-navigation.js";

// Import your web components here from the dist/ directory
import "./dist/extensions/controls/GeomapSelectionControlWrapper.js";
import "./dist/Geomap.js";
import "./dist/GeomapProvider.js";
import "./dist/GeomapHssProvider.js";
import "./dist/GeomapSpot.js";
import "./dist/GeomapContainer.js";
import "./dist/GeomapGeocircle.js";
import "./dist/GeomapCircle.js";
import "./dist/GeomapPolygon.js";
import "./dist/GeomapLine.js";
import "./dist/GeomapPoint.js";
import "./dist/GeomapFillLayer.js";
import "./dist/GeomapCircleLayer.js";
import "./dist/GeomapLineLayer.js";
import "./dist/GeomapHeatmapLayer.js";
import "./dist/GeomapSymbolLayer.js";
import "./dist/GeomapSource.js";
import "./dist/GeomapClusterSource.js";
import "./dist/GeomapImage.js";
import "./dist/GeomapRasterTiles.js";
import "./dist/GeomapArc.js";
import "./dist/GeomapFillLayerState.js";
import "./dist/GeomapCircleLayerState.js";
import "./dist/GeomapLineLayerState.js";

import "./dist/GeomapNavigationControl.js";
import "./dist/GeomapCopyrightControl.js";
import "./dist/GeomapContainerControl.js";
import "./dist/GeomapLegendControl.js";

import "./dist/GeomapScaleControl.js";
import "./dist/GeomapFullscreenControl.js";
import "./dist/GeomapNavigationControlComponent.js";
import "./dist/GeomapSpotComponent.js";
import "./dist/GeomapSelectionControl.js";
import "./dist/GeomapSelectionControlComponent.js";
import GeomapGeometry from "./dist/geometry/GeomapGeometry.js";
import GeomapGeometryUtil from "./dist/geometry/GeomapGeometryUtil.js";

import {
	setSelectionStyles, getSelectionStyles, setLongLatPrecision, getLongLatPrecision,
} from "./dist/config/Config.js";

window.geometry = GeomapGeometry;
window.geometryUtil = GeomapGeometryUtil;
window.configSelection = {
	getSelectionStyles,
	setSelectionStyles,
};
window.configGeometry = {
	setLongLatPrecision,
	getLongLatPrecision,
};

window["sap-ui-webcomponents-bundle"] = {
	renderFinished,
	configuration: {
		getAnimationMode,
		getLanguage,
		getTheme,
		setTheme,
		getNoConflict,
		setNoConflict,
		getCalendarType,
		getFirstDayOfWeek,
		setSelectionStyles,
		getSelectionStyles,
	},
};
