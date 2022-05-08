export default interface ISerializable {
	readonly id: number;
	serialize: () => { [key: string]: any };
}

export interface ISerializedJson {
	type: any;
	[key: string]: any;
}
