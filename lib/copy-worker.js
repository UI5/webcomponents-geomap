/**
 * copy-worker.js
 *
 * Copies the maplibre-gl ES-module worker from the resolved `maplibre-gl`
 * package into the webc's `src/generated/` and `dist/generated/` folders,
 * renaming it from `maplibre-gl-worker.mjs` to `maplibre-gl-worker.js`.
 *
 * Why rename? The worker content is ES-module code either way; the browser
 * decides module-vs-classic from `new Worker(url, { type: "module" })` (set
 * in `src/Geomap.ts`), not from the URL's extension. We ship it as `.js`
 * because:
 *
 *   1. `.js` is universally served as `application/javascript`; `.mjs`
 *      requires explicit server configuration which some strict-CSP /
 *      static-hosting environments lack.
 *   2. The main bundle entry is already `Geomap.js`, so a `.js` worker is
 *      consistent with the rest of `dist/`.
 *   3. Downstream consumers (e.g. openui5's `ui5-tooling-modules`) that
 *      emit assets via rollup's `prebuilt-chunk` type require `.js` on the
 *      emitted filename; `.mjs` input causes filename-mangling bugs there.
 *
 * Usage: `node lib/copy-worker.js <src> <destDir>`
 *   <src>     absolute path to `maplibre-gl/dist/maplibre-gl-worker.mjs`
 *   <destDir> directory to write `maplibre-gl-worker.js` into (created if missing)
 */
import fs from "fs";
import path from "path";

const [, , src, destDir] = process.argv;
if (!src || !destDir) {
	throw new Error("Usage: node lib/copy-worker.js <src> <destDir>");
}

if (!fs.existsSync(destDir)) {
	fs.mkdirSync(destDir, { recursive: true });
}

const dest = path.join(destDir, "maplibre-gl-worker.js");
fs.copyFileSync(src, dest);
