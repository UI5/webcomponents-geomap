[![REUSE status](https://api.reuse.software/badge/github.com/UI5/webcomponents-geomap)](https://api.reuse.software/info/github.com/UI5/webcomponents-geomap)

# UI5 Web Components - Geomap

Geomap Web Component for visualizing geospatial data based on [UI5 Web Components](https://github.com/SAP/ui5-webcomponents/).

The Geomap component can visualize GeoJSON data from various map/tile providers like ESRI, MapBox, Azure Maps, SAP HSS, etc.

It can mix the tiles provided by the map provider and GeoJSON describing features and layers
coming from another source(s) and visualize the different layers to represent these features.
Some of the main map features are:

- Visualize, pan, zoom, rotate, tilt the map
- Supports different features like point, line string, polygon, etc.
- Highly customizable markers on the fly
- Clustering of objects on the map when zoom in/out
- Fly to/perfect zoom
- Showing scale and copyright info
- Selection of objects
- Various events to allow the app to implement context menu, act on pan/zoom, map rendering, etc.

## Public APIs

The Geomap provides a custom tag `<ui5-geomap />` which has several properties, slots and events:

**Properties**

| Property                          | Description                                                            |
|-----------------------------------|------------------------------------------------------------------------|
| `centerLng`                       | Longitude of the point where the map is centered.                      |
| `centerLat`                       | Latitude of the point where the map is centered.                       |
| `zoom`                            | Zoom level of the map - the bigger, the more the map is zoomed.        |
| `rotation`                        | Rotation of the map in degrees, counter-clockwise from the north.      |
| `tilt`                            | Tilt of the map in degrees (0-60) relative to the screen's plane.      |
| `restrictedAreaWestSouthPointLng` | Longitude of the West-South point, defining the map's restricted area. |
| `restrictedAreaWestSouthPointLat` | Latitude of the West-South point, defining the map's restricted area.  |
| `restrictedAreaEastNorthPointLng` | Longitude of the East-North point, defining the map's restricted area. |
| `restrictedAreaEastNorthPointLat` | Latitude of the East-North point, defining the map's restricted area.  |
| `minZoom`                         | The minimum allowed zoom level.                                        |
| `maxZoom`                         | The maximum allowed zoom level.                                        |
| `minTilt`                         | The minimum allowed tilt level.                                        |
| `maxTilt`                         | The maximum allowed tilt level.                                        |

**Methods**
- `flyTo(lng, lat, zoom)` - Changes the center of the map to given coordinates and zooms the map.
- `getBounds()` - Returns the map boundaries of the current viewport.

**Events**

| Event               | Description                                                            |
|---------------------|------------------------------------------------------------------------|
| `map-load`          | Fired when the map has finished loading.                               |
| `map-click`         | Fired when the user clicked on the map.                                |
| `map-zoom`          | Fired when the user zoomed the map.                                    |
| `map-rotate`        | Fired when the user rotated the map.                                   |
| `map-tilt`          | Fired when the user tilted the map.                                    |
| `map-center`        | Fired when the user changed the center of the map (dragged or zoomed). |
| `map-mouseup`       | Fired when the user released the mouse button.                         |
| `map-mousemove`     | Fired when the user moved the mouse over the map.                      |
| `map-render`        | Fired when the map has rendered/re-rendered.                           |
| `map-bounds-change` | Fired when the map's boundaries have changed.                          |

## Install and Use

```bash
npm install @ui5/webcomponents-geomap
```

Once installed, import the ES module and use the custom tag:

```javascript
import "@ui5/webcomponents-geomap/dist/Geomap.js";
```

```html
<ui5-geomap></ui5-geomap>
```

## Content Security Policy (CSP) Requirements

This Web Component integrates [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) to provide interactive mapping capabilities.
Since MapLibre internally uses Web Workers and blob: URLs, certain Content Security Policy (CSP) directives must be enabled for the component to function correctly.

### Standard Mode (default)

If your environment allows Web Workers and child frames to be created from blob: sources, include the following in your CSP:
```text
worker-src blob:;
child-src blob:;
img-src data: blob:;
```

### Strict CSP Environments

For environments with strong Content Security Policies that disallow blob: workers, a CSP-safe bundle is provided:

`maplibre-gl-csp-worker.js`

Create `worker.js` in your application:
```js
importScripts(new URLSearchParams(self.location.search).get("worker"));
```

Provide the worker URL before initializing the component:
```ts
import { setWorkerPath } from "@ui5/webcomponents-geomap/dist/config/Config.js";

setWorkerPath("<path-to-your-worker.js>");
```

## Architecture

The Geomap web component extends `UI5Element` -- the base class from [UI5 Web Components](https://github.com/SAP/ui5-webcomponents/) that handles shadow DOM creation and lifecycle hooks.

- **Rendering engine:** [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) -- open-source, BSD-3-Clause, no vendor lock-in, no API keys required
- **Selection tools:** [Terra Draw](https://github.com/JamesLMilner/terra-draw) -- MIT-licensed library for lasso, rectangle, circle, and polygon selection
- **Map providers:** ESRI, MapBox, Azure Maps, HANA Spatial Services, and others

### Why Declarative?

Unlike imperative MapLibre usage, `ui5-geomap` provides a fully declarative API:

- **Encapsulation** -- just place the `<ui5-geomap>` tag; JS and CSS are shipped together
- **Lifecycle synchronization** -- child elements (sources, layers, markers) implicitly await the map's `load` event
- **Declarative binding** -- layers and sources are bound by HTML `id` attributes, no manual wiring
- **Unified property API** -- same API for initial setting and updates; no separate paint/layout calls
- **Framework-friendly** -- works with any framework's property binding (React, Angular, Vue, etc.)

## Development

### Prerequisites

- Node.js (LTS recommended)
- npm

### Setup

```bash
git clone https://github.com/UI5/webcomponents-geomap.git
cd webcomponents-geomap
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm start` | Dev server on port 8088 |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| `npm run lintfix` | Auto-fix lint issues |
| `npm run test:cypress` | Run Cypress component tests with coverage |
| `npm run test:cypress:open` | Cypress interactive/debug mode |

## Third-Party Software

This project includes the following third-party open source software components. Each component is subject to its own license terms.

| Library | License | Repository |
|---------|---------|------------|
| maplibre-gl | BSD-3-Clause | https://github.com/maplibre/maplibre-gl-js |
| terra-draw | MIT | https://github.com/JamesLMilner/terra-draw |
| terra-draw-maplibre-gl-adapter | MIT | https://github.com/JamesLMilner/terra-draw |
| UI5 Web Components | Apache-2.0 | https://github.com/SAP/ui5-webcomponents/ |

## Support, Feedback, Contributing

This project is open to feature requests/suggestions, bug reports etc. via [GitHub issues](https://github.com/UI5/webcomponents-geomap/issues). Contribution and feedback are encouraged and always welcome. For more information about how to contribute, the project structure, as well as additional contribution information, see our [Contribution Guidelines](CONTRIBUTING.md).

## Security / Disclosure
If you find any bug that may be a security problem, please follow our instructions at [in our security policy](https://github.com/UI5/webcomponents-geomap/security/policy) on how to report it. Please do not create GitHub issues for security-related doubts or problems.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone. By participating in this project, you agree to abide by its [Code of Conduct](https://github.com/SAP/.github/blob/main/CODE_OF_CONDUCT.md) at all times.

## Licensing

Copyright 2026 SAP SE or an SAP affiliate company and webcomponents-geomap contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/UI5/webcomponents-geomap).
