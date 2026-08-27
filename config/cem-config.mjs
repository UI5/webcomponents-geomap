import config from "@ui5/webcomponents-tools/lib/cem/custom-elements-manifest.config.mjs";

config.globs = ["src/!(*generated)/*.ts", "src/!(*bundle)*.ts", "src/!(*geometry)/*.ts"];

export default config;
