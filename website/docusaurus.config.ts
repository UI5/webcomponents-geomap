import path from 'path';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const baseUrl = process.env.BASE_URL || "/webcomponents-geomap/";
const siteUrl = process.env.SITE_URL || "https://ui5.github.io";

// Mirrors the getFullURL() helper from the ui5-webcomponents website:
// in development, use a root-relative path (so the link works on localhost);
// otherwise, use the absolute site URL (so the link works on the deployed site
// and the footer renders the external-link icon).
const DEVELOPMENT_ENVIRONMENT = process.env.NODE_ENV === "development";
const getFullURL = () => {
  return DEVELOPMENT_ENVIRONMENT ? `${baseUrl}` : `${siteUrl}${baseUrl}`;
};

const config: Config = {
  title: "UI5 Geomap",
	tagline: "",
	favicon: "img/favicon.ico",

	url: siteUrl,
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
        src: "img/footer/sap-1920-1440.svg",
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
              label: "Documentation",
              to: "/documentation/getting-started/first-steps",
            },
            {
              label: "Components",
              to: "/components/Geomap",
            },
            {
              label: "FAQ",
              to: "/documentation/faq",
            },
          ],
        },
        {
          title: "Legal & Privacy",
          items: [
            {
              label: "Privacy",
              href: `${getFullURL()}Privacy`,
              target: "_blank",
              rel: "noopener noreferrer",
            },
            {
              label: "Legal Disclosure",
              href: "https://www.sap.com/impressum",
            },
            {
              label: "Terms of Use",
              href: "https://www.sap.com/terms-of-use",
            },
            {
              label: "Trademark",
              href: "https://www.sap.com/trademark",
            },
          ],
        },
        {
          title: "Contact Us",
          items: [
            {
              label: "Report Issue",
              href: "https://github.com/UI5/webcomponents-geomap/issues/new",
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
