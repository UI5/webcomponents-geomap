export type CamelToKebab<S extends string> = S extends `${infer T}${infer U}`
	? U extends Uncapitalize<U>
		? `${Uncapitalize<T>}${CamelToKebab<U>}`
		: `${Uncapitalize<T>}-${CamelToKebab<U>}`
	: S;

export type Pulse = {
	width: number,
	height: number,
	data: Uint8Array,
	render: () => boolean
};
