import { cp, readdir, rm, readFile, writeFile } from "fs/promises";
import path from "path";

await Promise.all([
    cp("../dist", "local-cdn/local-cdn/geomap/dist", {recursive: true}),
    cp("../node_modules/maplibre-gl", "local-cdn/local-cdn/maplibre-gl", {recursive: true}),
    cp("../node_modules/@ui5/webcomponents-base/dist", "local-cdn/local-cdn/ui5-base/dist", {recursive: true}),
]);

// Patch UI5ElementMetadata.js to fix cross-realm instanceof failure on HTMLElement.
// Elements slotted into ShellBar from a different JS realm (e.g. playground iframe)
// have their own HTMLElement constructor, so `el instanceof HTMLElement` throws.
// We replace it with a nodeType check which works across realms.
const metadataPath = "local-cdn/local-cdn/ui5-base/dist/UI5ElementMetadata.js";
let metadataContent = await readFile(metadataPath, "utf-8");
const oldCheck = `const validateSingleSlot = (value, slotData) => {
    value && getSlottedNodes(value).forEach(el => {
        if (!(el instanceof slotData.type)) {
            throw new Error(\`The element is not of type \${slotData.type.toString()}\`);
        }
    });
    return value;
};`;
const newCheck = `const isValidSlotType = (el, type) => {
    if (type === HTMLElement) {
        return el.nodeType === el.ELEMENT_NODE;
    }
    if (type === Node) {
        return el.nodeType !== undefined;
    }
    return el instanceof type;
};
const validateSingleSlot = (value, slotData) => {
    value && getSlottedNodes(value).forEach(el => {
        if (!isValidSlotType(el, slotData.type)) {
            throw new Error(\`The element is not of type \${slotData.type.toString()}\`);
        }
    });
    return value;
};`;
if (metadataContent.includes(oldCheck)) {
    metadataContent = metadataContent.replace(oldCheck, newCheck);
    await writeFile(metadataPath, metadataContent, "utf-8");
}

const files = await readdir("local-cdn", {recursive: true, withFileTypes: true});
const filesToDelete = files.filter(f => {
    return f.isFile() && !f.name.endsWith(".js") && !f.name.endsWith(".svg") && !f.name.endsWith(".d.ts") && !f.name.endsWith("package.json")
});
filesToDelete.map(f => rm(path.join(f.path, f.name)));
