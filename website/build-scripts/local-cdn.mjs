import { cp, readdir, rm } from "fs/promises";
import path from "path";

await Promise.all([
    cp("../dist", "local-cdn/local-cdn/geomap/dist", {recursive: true}),
    cp("../node_modules/maplibre-gl", "local-cdn/local-cdn/maplibre-gl", {recursive: true}),
]);

const files = await readdir("local-cdn", {recursive: true, withFileTypes: true});
const filesToDelete = files.filter(f => {
    return f.isFile() && !f.name.endsWith(".js") && !f.name.endsWith(".svg") && !f.name.endsWith(".d.ts") && !f.name.endsWith("package.json")
});
filesToDelete.map(f => rm(path.join(f.path, f.name)));