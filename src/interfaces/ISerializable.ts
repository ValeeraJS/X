export default interface ISerializable {
	id: number;
	serialize: () => { [key: string]: any };
}

export interface ISerializedJson {
	type: any;
	[key: string]: any;
}
