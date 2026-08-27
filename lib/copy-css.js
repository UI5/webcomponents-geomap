import fs from "fs";

const cssFilePath = process.argv[2];
const cssJsFilePath = process.argv[3];

const content = `${fs.readFileSync(cssFilePath)}`;
const newContent = `export default \`${content}\`;`;
fs.writeFileSync(cssJsFilePath, `${newContent}`);
