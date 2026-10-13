import path from 'path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const baseUrl = process.env.BASE_URL || "/webcomponents-geomap/";

const config: Config = {
  title: "UI5 Geomap",
	tagline: "",
	favicon: "img/favicon.ico",

	url: process.env.SITE_URL || "https://ui5.github.io",
	baseUrl,

	// GitHub pages deployment config.
	organizationName: "UI5",
	projectName: "webcomponents-geomap",
	trailingSlash: false,
	staticDirectories: ['static', 'local-cdn'],

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    function playgroundWebpackFix(): import('@docusaurus/types').Plugin {
      return {
        name: 'playground-elements-webpack-fix',
        configureWebpack() {
          return {
            module: {
              rules: [
                {
                  test: /node_modules[\\/]playground-elements/,
                  parser: { url: false },
                },
                {
                  test: /playground-project\.js$/,
                  include: /node_modules[\\/]playground-elements/,
                  use: [{
                    loader: path.resolve(__dirname, 'build-scripts/playground-import-meta-loader.cjs'),
                    options: { baseUrl },
                  }],
                },
              ],
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "UI5 Geomap",
      logo: {
        alt: "UI5 Geomap",
        src: "img/logos/LogoWater.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "documentationSidebar",
          label: "Documentation",
        },
        {
          type: "docSidebar",
          sidebarId: "componentsSidebar",
          position: "left",
          label: "Components",
        },
        {
          type: "docSidebar",
          sidebarId: "samplesSidebar",
          label: "Samples",
        },
        {
          type: "custom-settingsNavbarItem",
          position: "right",
        },
        {
          type: "custom-GitHubNavbarItem",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `© Copyright ${new Date().getFullYear()}, SAP SE and UI5 Web Components Contributors`,
      logo: {
        alt: "SAP Logo",
        src: "https://sap.github.io/ui5-webcomponents/img/footer/sap-1920-1440.svg",
        width: 160,
        height: 51,
      },
      links: [
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              to: "https://github.com/UI5/webcomponents-geomap",
            },
          ],
        },
        {
          title: "Docs",
          items: [
            {
              label: "Components",
              to: "/components/Geomap",
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
