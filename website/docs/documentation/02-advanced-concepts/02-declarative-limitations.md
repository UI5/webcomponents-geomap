# Declarative API: Limitations and Performance

The declarative API is ergonomic for small-to-medium maps. This page documents where it stops scaling, what each limitation stems from, and when to reach for the imperative paths instead.

## Limitations

### 1. Per-Element Source and Layer for Shape Primitives

- Each `<ui5-geomap-circle>`, `<ui5-geomap-polygon>`, and `<ui5-geomap-line>` owns its **own** MapLibre source **and** layer (`src/GeomapShape.ts`)
- N shape elements therefore produce N sources + N layers; the component does **not** merge shapes into a shared source
- For many features, use `<ui5-geomap-source>` + a layer element with a single GeoJSON — one source, one layer, GPU-rendered

```html
<!-- 1,000 shape elements = 1,000 sources + 1,000 layers -->
<ui5-geomap>
    <ui5-geomap-circle lat="48.1" lng="11.5" radius="500"></ui5-geomap-circle>
    <ui5-geomap-circle lat="48.2" lng="11.6" radius="500"></ui5-geomap-circle>
    <!-- ...998 more -->
</ui5-geomap>
```

vs

```html
<!-- 1 source + 1 layer for the whole dataset -->
<ui5-geomap>
    <ui5-geomap-source id="points" geojson-url="./points.json"></ui5-geomap-source>
    <ui5-geomap-circle-layer source="points" radius="5" fill-color="blue"></ui5-geomap-circle-layer>
</ui5-geomap>
```

### 2. Scale Thresholds for Per-Feature Elements

The thresholds below are approximate and device-dependent; they are not based on empirical benchmarks of this component. Treat them as rules of thumb for `<ui5-geomap-spot>`, `<ui5-geomap-circle>`, `<ui5-geomap-polygon>`, `<ui5-geomap-line>` and similar per-feature elements.

:::warning
- **> 5,000 elements** — noticeable degradation: slow pan/zoom, delayed click handlers
- **> 10,000 elements** — significant browser memory pressure and layout recalculation storms
- **> 50,000 elements** — risk of tab crash, especially on mobile or constrained devices
:::

Rule of thumb: above ~1,000 features, prefer `<ui5-geomap-source>` + a layer element over per-feature elements.

### 3. Slot Mutations Are Not Diffed

- Appending or removing a child triggers UI5Element's `MutationObserver`, which calls the geomap's `handleInvalidation` with a slot change (`src/Geomap.ts`)
- The geomap responds by re-iterating **all** children through `connectToItems()` + `connectToDraw()` — there is no delta
- Per-child `connectToMap` is idempotent, so steady-state cost is an O(N) scan rather than re-wiring; a tight loop appending 10,000 elements still produces 10,000 microtask-batched invalidations

:::note
For high-frequency updates, write the full feature set to a `<ui5-geomap-source>` by assigning its `geojson` property, instead of appending/removing many child elements.
:::

```js
// Prefer this for frequent updates
document.getElementById("points").geojson = featureCollection;
```

vs

```js
// Hot-loop DOM mutation — triggers one UI5 invalidation per append
for (const f of features) {
    const el = document.createElement("ui5-geomap-spot");
    el.lat = f.lat; el.lng = f.lng;
    geomap.appendChild(el);
}
```

### 4. Geometry Rebuilds on Any Point Change

- For `<ui5-geomap-polygon>`, `<ui5-geomap-line>`, and `<ui5-geomap-circle>`, mutating any child point (or adding/removing one) causes a **full** geometry rebuild and `setData` on the underlying source (`src/GeomapShape.ts`, `src/GeomapPolygon.ts`)
- There is no partial update; a single moved vertex re-serializes the whole shape

For high-frequency updates on a shape, assign the complete `geojson` to a `<ui5-geomap-source>` once rather than mutating many point children in sequence.

### 5. Markers Re-Sync on Every Render

- `GeomapMarkerBase.onBeforeRendering` runs `updateMarkerInstance` on every invalidation (`src/GeomapMarkerBase.ts`, `src/GeomapSpot.ts`)
- With many `<ui5-geomap-spot>` elements, any attribute change on the parent map re-writes 7 visual properties per spot per render pass
- Visual-property syncing is intentional (markers are not recreated), but the cost scales linearly with the number of spots on the map

### 6. Complex MapLibre Expressions Still Require JavaScript

- HTML attributes serialize simple scalars; MapLibre expression arrays (e.g. `["case", ["get", "pop"], 10, 2]`) can only be set via the JS property
- See also point 6 of the sibling [Assessment of Declarative Features](./01-declarative-vs-imperative.md) page for a worked example

```js
document.getElementById("layer").fillColor = ["interpolate", ["linear"], ["get", "population"], 0, "#F2F12D", 1000000, "#DA9C20"];
```

### 7. Style-Change Listener Accumulation

- Each layer registers a `styledata` listener in `createLayer` to re-add itself if the MapLibre style drops it (`src/GeomapLayerBase.ts`)
- Previously registered handlers are not removed across provider or style switches; the listener count grows linearly per layer with each style change

:::note
Avoid repeatedly swapping `<ui5-geomap-provider>` or the map style at runtime on long-lived maps. If style switching is unavoidable, consider recreating the geomap element rather than mutating the provider in place.
:::

### 8. Mixing Declarative Children with Imperative Map Writes

- Direct calls on `geomap.map.*` (`addSource`, `addLayer`, `setStyle`, …) bypass the slot / invalidation pipeline entirely
- Imperative additions that share an `id` with a declarative child can conflict with the layer-restore-on-`styledata` path (point 7), producing duplicate or vanishing layers after a style change
- Choose one owner per source/layer id:
    - **Declarative** for static scenes and HTML-authored maps
    - **Imperative via `<ui5-geomap-source>.geojson = ...`** for high-frequency data updates
    - **Direct `geomap.map.*`** only for ids that are not also declared as children

### 9. When to Prefer the Imperative Path

Quick decision list:

- **Dataset > ~1,000 features** → `<ui5-geomap-source>` + layer element, not per-feature elements
- **Frequent data refresh** → assign `source.geojson`, do not append/remove many child elements
- **Complex paint/layout expressions** → assign the JS property, not an HTML attribute
- **High-frequency camera animation** → call `geomap.flyTo(...)` or `geomap.map.*` directly, do not update attributes in a loop

## See Also

- [Assessment of Declarative Features](./01-declarative-vs-imperative.md) — the counterpart page documenting the benefits of the declarative API
