import cypressConfig from "@ui5/webcomponents-tools/components-package/cypress.config.js";
import path from "path";
import { fileURLToPath } from "node:url";
import task from "@cypress/code-coverage/task.js";
import viteConfig from "./config/vite.config.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cypressConfig.reporter = "junit";
cypressConfig.reporterOptions = {
  mochaFile: "cypress/reports/report-[hash].xml",
  useFullSuiteTitle: true,
  rootSuiteTitle: " ",
  toConsole: true,
};

cypressConfig.component.devServer.viteConfig = viteConfig;
cypressConfig.component.supportFile = path.join(__dirname, "./cypress/support/component.js");
cypressConfig.component.setupNodeEvents = function setupNodeEvents(on, config) {
  task(on, config);

  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.family === "chromium") {
      launchOptions.args.push("--use-gl=angle");
      launchOptions.args.push("--use-angle=swiftshader");
      launchOptions.args.push("--ignore-gpu-blocklist");
      launchOptions.args.push("--enable-webgl");
    }
    return launchOptions;
  });

  return config;
};

export default cypressConfig;
