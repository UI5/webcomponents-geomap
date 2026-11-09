# Running the Website

The UI5 Geomap website is the entry point of the project documentation. The app includes the documentation, API reference, and samples for the available web components.

The website can be run locally to test your changes and samples.

## Run the Website

The website lives in its own `website` folder. From the repository root, run:

```bash
cd website
npm install
npm run start:website
```

This builds all the necessary assets (the components, the API reference, and the local CDN) and then starts a local server on your machine and opens the website in your browser.

However, in most cases you already have the project built, so it is faster to just start the Docusaurus dev server:

```bash
cd website
npm start
```

**Note:** In case of issues with the second flow, most likely you need to run `npm run start:website` once so the generated assets (API reference and local CDN) are available.

## How Component Pages Are Generated

Component pages are **automatically generated** from the API reference, which is derived from the JSDoc comments in the components' TypeScript source. The generation runs as part of `npm run start:website` and `npm run build:website`.
