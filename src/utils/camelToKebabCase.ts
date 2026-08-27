import { camelToKebabCase as camelToKebabCaseOriginal } from "@ui5/webcomponents-base/dist/util/StringHelper.js";
import type { CamelToKebab } from "../types/utils.js";

export default function camelToKebabCase<S extends string>(input: S): CamelToKebab<S> {
	return camelToKebabCaseOriginal(input) as CamelToKebab<S>;
}
