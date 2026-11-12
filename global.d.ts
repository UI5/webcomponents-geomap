declare module "*.css.js" {
    const content: string;
    export default content;
}

// Website playground mock: the Editor import map remaps this specifier to the
// ESM build of maplibre-gl (maplibre-gl.mjs). We re-export the classes from
// MaplibreSamplesMock.ts; typings line up with the real package.
declare module "mocked-samples-maplibre-gl" {
    export * from "maplibre-gl";
}
