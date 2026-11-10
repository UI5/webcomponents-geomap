# Definition of Done

This page is a checklist of the common pitfalls contributors should run through before considering a change to UI5 Geomap done.

## Properties

- **Am I changing public properties without user interaction?**

  Public properties belong to the application — apps typically bind them to a model (`centerLng="{/lng}"`, `zoom="{/zoom}"`). If Geomap mutates a public property on its own schedule, the app's model drifts out of sync. Public properties may only change internally in response to real user interaction, and always in combination with firing the matching event. For example, when the user drags the map, `centerLng` / `centerLat` are updated and `map-center` is fired; when the user zooms, `zoom` is updated and `map-zoom` is fired.

- **Have I set `noAttribute` for private properties that are not used for CSS?**

  To keep the component's DOM simple, use `noAttribute: true` on all private properties that are not needed for CSS rules. Only promote state to an attribute when a selector actually depends on it.

- **Does my CSS handle the default values for enum properties?**

  If a sub-component is styled differently based on an enum, do not forget to write CSS that also applies the default styling when the property is not set. For a control that accepts `GeomapControlPosition` (`TopLeft` / `TopRight` / `BottomLeft` / `BottomRight`), do not style only `:host([position="TopLeft"])` — cover the bare `:host` selector too, so the default rendering is still correct when the attribute is absent.

## Events

- **Do I fire an event on every user interaction?**

  Every interaction must surface as an event so applications can react and update their models. On `<ui5-geomap>` that means: dragging the map fires `map-center`, scrolling/pinching fires `map-zoom`, rotating fires `map-rotate`, tilting fires `map-tilt`, clicking a feature produces `map-click` and (where applicable) `selection-set`. If you add a new interaction path, add the corresponding event.

- **Do I allow the application to prevent the default behaviour?**

  Make an event preventable only when there is a sensible reason for the app to cancel it. In Geomap this is already the case for pointer-driven events — `map-click`, `map-dblclick`, `map-mouseup`, `map-contextmenu`, and `map-error` are declared with `cancelable: true`, and the firing site checks the return value of `fireDecoratorEvent(...)` before continuing. Lifecycle events such as `map-load` and `map-render` are not cancelable — there is nothing meaningful for the app to abort.

- **Have I described my event's details?**

  If an event carries payload, declare a TypeScript type for its detail, reference the type in `eventDetails`, use it with `fireDecoratorEvent`, and export it as a named type. Geomap already follows this — e.g. `MapCenterEventDetail`, `MapClickEventDetail`, and the `{ feature: GeoJSONFeature }` payload on `selection-set`. New events with a payload must do the same.

## CSS

- **Did I put all overstyling-relevant CSS properties on the host?**

  Style the `:host` rather than inner shadow DOM as much as possible — especially sizing, margins, borders, and the positioning of overlay controls — so applications can overstyle the component within reason. This matters more for Geomap than for the average Web Component: the `sap.ui.geomap` wrapper is declared with `noLibraryCSS: true`, so there is no library-wide stylesheet for apps to lean on. Everything an app can reasonably restyle flows through host-level CSS.

## Map lifecycle & integration

- **Am I cleaning up the MapLibre instance on disconnect?**

  Geomap wires its MapLibre map, event listeners, and timers in `onEnterDOM`; the symmetric teardown belongs in `onExitDOM`. A Geomap removed from the DOM — by navigation, by `v-if`-style framework toggles, or by a hot reload — must release its MapLibre `map`, detach its listeners, clear `_clickTimer` and `_exitTimeout`, and null out any references, or the page accumulates phantom map instances and leaks memory.

- **Am I leaking MapLibre internals through the public API?**

  Public properties, events, slots, and method return types must be plain data — numbers, strings, enums, tuples, plain objects. Never a `maplibregl.Map`, `Source`, `Layer`, or raw `LngLat` on the public surface. The `sap.ui.geomap` wrapper is generated directly from this repo's Custom Elements Manifest, so a leaked MapLibre type crosses the public API boundary and ends up in OpenUI5 too. `getBounds()` currently returns `any` for this reason — treat that as technical debt, not as license to widen the surface further.

- **Am I handling large feature sets without re-rendering everything?**

  When many `GeomapPoint`s or shapes live under `items`, do not reconcile the entire set on every property change. Update MapLibre sources incrementally, batch style updates, and avoid rebuilding a source from scratch when a single feature moved. The user-visible symptom of getting this wrong is pan/zoom jank well below the ~1,000-feature threshold documented in [Declarative API: Limitations and Performance](../advanced-concepts/declarative-limitations); above that threshold, apps are expected to switch to `<ui5-geomap-source>` + a layer element anyway.

- **Have I explicitly imported every icon my sub-component uses?**

  Icons must be imported at the file that needs them — e.g. `import "@ui5/webcomponents-icons/dist/map.js";` in `GeomapSpotComponent.ts`, or the individual `add` / `less` / `expand` imports in `GeomapNavigationControlComponent.ts`. Do not depend on `Assets.ts` or `@ui5/webcomponents-icons/dist/AllIcons.js` to drag your icons in — that only works in the test bundle and when consumers happen to pull all icons.

## Testing

- **Are my tests reloading the page unnecessarily?**

  Calling `cy.visit(...)` (or the equivalent navigation helper) just to reset state between assertions makes the whole suite slower and hides lifecycle bugs. Prefer adding new assertions to existing tests when it makes sense, and reset state through the component's own API rather than by re-loading the sample page.

- **Are my tests really testing my code?**

  Tests that assert things like "setting a property creates an attribute" exercise the Web Components framework, not Geomap. Skip them and spend the budget on behaviour that is genuinely ours — map interaction flows, event payloads, bounds/zoom math, cleanup on disconnect.
