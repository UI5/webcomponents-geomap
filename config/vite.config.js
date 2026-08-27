// vite.config.js
import { defineConfig } from "vite";
import virtualIndex from "@ui5/webcomponents-tools/lib/dev-server/virtual-index-html-plugin.js";
import { checker } from "vite-plugin-checker";
import istanbul from "vite-plugin-istanbul";

const ASSET_URL = process.env.ASSET_URL || "";

export default defineConfig(async () => {
	const data = await virtualIndex();
	return {
		build: {
			sourcemap: true,
			emptyOutDir: false,
			assetsInlineLimit: 0,
		},
		// Pre-declare the JSX runtimes (pulled in implicitly via tsconfig
		// `jsxImportSource: "@ui5/webcomponents-base"`) so Vite optimizes them
		// at dev-server startup. Otherwise the first spec that actually mounts
		// a JSX template discovers them mid-run, Vite logs
		//   ✨ optimized dependencies changed. reloading
		// and the dependency-graph reload breaks the next spec's dynamic import
		// with `Failed to fetch dynamically imported module: …/SomeSpec.cy.ts`.
		// Seen in CI run 39739674 (GeomapCircleLayer.cy.ts) right after the
		// Map.cy.ts run triggered a reload.
		optimizeDeps: {
			include: [
				"@ui5/webcomponents-base/jsx-runtime",
				"@ui5/webcomponents-base/jsx-dev-runtime",
			],
		},
		plugins: [
			istanbul({
				include: ["src/**/*", "src/*", "!src/**/*.tsx"], // Include source files excluding .tsx
				exclude: ["node_modules", "test/**/*", "test/*"], // Exclude tests and dependencies
				extension: [".ts", ".js", ".tsx"], // Include TypeScript files
				cypress: true,
				requireEnv: false,
			}),
			data,
			checker({
				typescript: true,
			}),
		],
		base: ASSET_URL,
	};
});
