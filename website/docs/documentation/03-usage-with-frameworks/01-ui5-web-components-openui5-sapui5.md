# UI5 Geomap Web Component & OpenUI5/SAPUI5

UI5 Geomap is delivered to OpenUI5 and SAPUI5 as a first-party wrapper library, `sap.ui.geomap`. It has been public since SAPUI5 1.155 and is generated directly from this repo's Custom Elements Manifest — each control is a thin `SapWebComponent.extend()` bridge around a `Ui5Geomap*` Web Component, so there is no hand-written glue code between the two worlds.

This differs from the generic route for UI5 Web Components, which consumes components via `ui5-tooling-modules` and the npm package name as an XML namespace. For Geomap you do not need that setup — you consume the library the classic way, exactly like `sap.m` or `sap.ui.table`. If you are integrating other, non-Geomap Web Components into the same app, see the upstream guide at [ui5.github.io/webcomponents/docs/frameworks/SAPUI5/](https://ui5.github.io/webcomponents/docs/frameworks/SAPUI5/).

## Prerequisites

- SAPUI5 or OpenUI5 **1.155 or later**.
- Dependencies `sap.ui.core` and `sap.m` are part of any standard SAPUI5/OpenUI5 app, so no additional installation is required.
- No npm packages, no `ui5-tooling-modules`, no extra bundling step — the wrapper is shipped inside SAPUI5/OpenUI5 itself.

The library is declared with `noLibraryCSS: true`: there is no separate `library.css` to load. The component ships its styles via the Shadow DOM.

## Add the library to your app

Declare `sap.ui.geomap` as a library dependency so SAPUI5 loads it before your views instantiate.

**Option 1 — in `manifest.json`** (recommended for modern apps):

```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "sap.m": {},
        "sap.ui.geomap": {}
      }
    }
  }
}
```

**Option 2 — in the bootstrap tag of `index.html`:**

```html
<script
  id="sap-ui-bootstrap"
  src="resources/sap-ui-core.js"
  data-sap-ui-libs="sap.m, sap.ui.geomap"
  data-sap-ui-theme="sap_horizon"
  data-sap-ui-async="true"
  data-sap-ui-compatVersion="edge"
></script>
```

## Use in XML views

Add the `sap.ui.geomap` namespace to your view root and use the controls like any other SAPUI5 control. Properties bind, aggregations bind, and events wire up through the usual XML view syntax.

```xml
<mvc:View
  controllerName="my.app.controller.MapView"
  xmlns:mvc="sap.ui.core.mvc"
  xmlns="sap.m"
  xmlns:geomap="sap.ui.geomap">

  <Page title="Map">
    <geomap:Geomap
      id="map"
      centerLng="{/center/lng}"
      centerLat="{/center/lat}"
      zoom="{/zoom}"
      items="{/points}"
      mapClick=".onMapClick">

      <geomap:mapControls>
        <geomap:GeomapProvider styleUrl="{/styleUrl}" />
      </geomap:mapControls>

      <geomap:items>
        <geomap:GeomapPoint lng="{lng}" lat="{lat}" />
      </geomap:items>
    </geomap:Geomap>
  </Page>
</mvc:View>
```

A few things to note from the snippet:

- `items` is the default aggregation on `Geomap` (it maps to the component's default slot), so `<geomap:GeomapPoint>` children can also be written inline without the explicit `<geomap:items>` wrapper.
- Event names from the Web Component are dashed (`map-click`); in the SAPUI5 wrapper they become camelCase, so the XML attribute is `mapClick`.
- Every property is bindable with the standard `{model>path}` syntax — nothing special is needed on top of the normal SAPUI5 data-binding story.

## Use in controllers

Require the controls you work with directly, and call their APIs the same way as any SAPUI5 control.

```javascript
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/geomap/library"
], function (Controller, JSONModel, geomapLib) {
  "use strict";

  const GeomapControlPosition = geomapLib.GeomapControlPosition;

  return Controller.extend("my.app.controller.MapView", {

    onInit: function () {
      this.getView().setModel(new JSONModel({
        center: { lng: 13.405, lat: 52.52 },
        zoom: 10,
        styleUrl: "https://demotiles.maplibre.org/style.json",
        points: [
          { lng: 13.405, lat: 52.52 },
          { lng: 13.388, lat: 52.517 }
        ]
      }));
    },

    onMapClick: function (oEvent) {
      const oMap = this.byId("map");
      const oBounds = oMap.getBounds();
      // react to the click, inspect bounds, update state, ...
    },

    flyToBerlin: function () {
      this.byId("map").flyTo(13.405, 52.52, 12);
    },

    // Example: reading the enum for positioning an overlay control
    topRight: function () {
      return GeomapControlPosition.TopRight;
    }
  });
});
```

The `sap.ui.geomap.GeomapControlPosition` enum (`TopLeft` / `TopRight` / `BottomLeft` / `BottomRight`) is exposed on the library object and is the type used by controls that accept a positioned-overlay slot.

## API mapping

The mapping between the Web Component surface and the `sap.ui.geomap` wrapper follows the same conventions used across UI5 Web Components:

| UI5 Geomap Web Component | sap.ui.geomap | Notes |
|---|---|---|
| properties | properties | Standard UI5 getters/setters (`Geomap#getZoom()` / `Geomap#setZoom()`); all bindable with `{model>path}`. |
| slots | aggregations | `items`, `mapControls` — accessed with the usual `add*` / `get*` / `remove*` methods. |
| events | events | Dashed Web Component names become camelCase in UI5 (`map-click` → `mapClick`, `map-bounds-change` → `mapBoundsChange`). |
| methods | methods | Any Web Component method is callable directly, e.g. `Geomap#flyTo(lng, lat, zoom)`, `Geomap#getBounds()`. |
| enums | types | Exposed on the library object, e.g. `sap.ui.geomap.GeomapControlPosition`. |

## Available controls

All controls live flat under `sap.ui.geomap.*` — there are no sub-namespaces. The library ships 34 controls covering the map surface itself (`Geomap`), geometric features (points, lines, polygons, circles, rectangles), overlay and provider controls (`GeomapProvider`, legend, scale), and the layer/source primitives that back them. For the full per-control reference — properties, aggregations, events, methods — see the [Components](../../components) section of this site; the API documented there applies directly through the wrapper, modulo the mapping rules above.

## See also

- Generic UI5 Web Components in SAPUI5 (upstream): [ui5.github.io/webcomponents/docs/frameworks/SAPUI5/](https://ui5.github.io/webcomponents/docs/frameworks/SAPUI5/)
- SAPUI5 "Using Web Components" topic: [ui5.sap.com — topic 1c80793df5bb424091954697fc0b2828](https://ui5.sap.com/#/topic/1c80793df5bb424091954697fc0b2828)
