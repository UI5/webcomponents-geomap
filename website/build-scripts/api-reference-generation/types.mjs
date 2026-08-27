import fs from "fs/promises";
import path from "path";
import { parseDeclaration } from "./component-file.mjs";
import {
	findAllImplementations,
	getInterfaces,
	getEnums,
	realPackagesName,
} from "./manifest.mjs";

const generateTypes = async () => {
	const packageName = "geomap";
	await fs.mkdir(`./docs/components/enums`, { recursive: true });
	await fs.mkdir(`./docs/components/interfaces`, {
		recursive: true,
	});

	Promise.all(
		["enums", "interfaces"].map(async typeName => {
			await fs.writeFile(
				path.join(`./docs/components/${typeName}/README.mdx`),
				`---
title: ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}
---

import DocCardList from '@theme/DocCardList';

<DocCardList />`,
			);
		}),
	);

	const intefaces = getInterfaces(realPackagesName(packageName));
	const enums = getEnums(realPackagesName(packageName));

	intefaces.forEach(async declaration => {
		declaration._implementations = findAllImplementations(declaration);

		await fs.writeFile(
			path.join(
				`./docs/components/interfaces`,
				`${declaration.name}.mdx`,
			),
			parseDeclaration(declaration, packageName),
		);
	});

	enums.forEach(async declaration => {
		await fs.writeFile(
			path.join(
				`./docs/components/enums`,
				`${declaration.name}.mdx`,
			),
			parseDeclaration(declaration, packageName),
		);
	});

	if (intefaces.length === 0) {
		await fs.rm(`./docs/components/interfaces`, { recursive: true });
	}
	if (enums.length === 0) {
		await fs.rm(`./docs/components/enums`, { recursive: true });
	}
};

export default generateTypes;
