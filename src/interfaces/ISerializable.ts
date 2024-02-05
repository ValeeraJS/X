import { ComponentTag } from "./IComponent";

export interface ISerializable {
	serialize: () => { [key: string]: any };
}

export interface IECSSerializedJson {
	id: number;
	class: string;
	name: string;
	disabled: boolean;
	[key: string]: any;
}

export interface IComponentSerializedJson<T> extends IECSSerializedJson {
	data: T;
	tags: ComponentTag[];
}

export interface ISystemSerializedJson extends IECSSerializedJson {
	autoUpdate: boolean;
	priority: number;
}

export interface IWorldSerializedJson extends IECSSerializedJson {
	systems: number[];
	entities: number[];
}

export interface IEntitySerializedJson extends IECSSerializedJson {
	components: number[];
}
