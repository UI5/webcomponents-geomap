const getScripts = require("@ui5/webcomponents-tools/components-package/nps.js");

const options = {
	port: 8088,
	typescript: true,
	dev: true,
};

const scripts = getScripts(options);
//scripts.lint = ""; // remove this line once the issue with the linter is resolved
scripts.build.bundle = `vite build -c config/vite.config.js --mode testing`;

// In CI we drop the `--dev` flag from CEM analyze/validate. With `--dev`, the
// analyzer dumps every JSDoc/type-reference diagnostic via
// displayDocumentationErrors() and the validator runs internal-schema checks
// that throw — together they produce a very noisy CI build log. We still emit
// dist/custom-elements.json (consumed by the playground's API reference and
// the auto-generated VS Code/JetBrains custom-data files) and still run
// public-schema validation, so the manifest contract is preserved. Locally,
// `dev: true` keeps the JSDoc diagnostics surfaced for authoring.
// See node_modules/@ui5/webcomponents-tools/lib/cem/{custom-elements-manifest.config.mjs,validate.js}.
if (process.env.CI) {
	scripts.generateAPI.generateCEM = scripts.generateAPI.generateCEM.replace(/\s+--dev\b/, "");
	scripts.generateAPI.validateCEM = scripts.generateAPI.validateCEM.replace(/\s+--dev\b/, "");
}

// Add the copy command to the prepare command because we need it to copy maplibre worker and css files.
// The copy was removed from tools project and bring it back with PR #9942 with "legacy" flag. However, copy from
// the tools project copies other files and breaks the lit templates. So we modify the prepare script and just adds
// our own copy script.
scripts.prepare.default = scripts.prepare.default.replace("copyProps", "copy copyProps");

// Prepend 2 more jobs to the copy command (important to be before everything else)
const oldCopyDefault = scripts.copy.default.split("nps ")[1]; // take whatever is after the opening "nps "
scripts.copy.default = `nps copy.worker copy.workerToDist copy.css ${oldCopyDefault}`;

// Copy the worker file locally so that it can be passed to the URL constructor.
// maplibre-gl v6+ ships an ES module worker (maplibre-gl-worker.mjs); the old
// classic/CSP worker (maplibre-gl-csp-worker.js) was removed with the UMD bundles.
// We copy-and-rename to `.js` on the way out (see lib/copy-worker.js for the
// reasoning). The source file stays `.mjs` because that's the filename
// `maplibre-gl` ships in its own `dist/`.
const workerPath = require.resolve("maplibre-gl/dist/maplibre-gl-worker.mjs");
scripts.copy.worker = `node ./lib/copy-worker.js "${workerPath}" src/generated/`;

// The default copy.src step only copies *.js / *.json from src/ to dist/, so the
// worker file has to be propagated separately or runtime imports of
// "./generated/maplibre-gl-worker.js" from dist/Geomap.js fail at load time.
scripts.copy.workerToDist = `node ./lib/copy-worker.js "${workerPath}" dist/generated/`;

scripts["lint:ci"] = `${scripts.lint} -f json -o reports/eslint.json`;
scripts["test-cy"] = `${scripts["test-cy-ci"]}`;

// @ui5/webcomponents-tools hardcodes `--browser chrome` in test-cy-ci. CI and
// Piper both run inside ppiper/node-browsers, which ships chromium (not chrome).
// Rewrite the flag globally so every workflow exercises the same browser.
scripts["test-cy-ci"] = scripts["test-cy-ci"].replace(/--browser \w+/, "--browser chromium");

// Copy the CSS file locally in .css.js form
const cssFilePath = require.resolve("maplibre-gl/dist/maplibre-gl.css");
scripts.copy.css = `node ./lib/copy-css.js ${cssFilePath} src/generated/maplibre-gl.css.js`;

module.exports = {
	scripts,
};
