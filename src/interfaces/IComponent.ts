import IComponentManager from "./IComponentManager";
import ISerializable from "./ISerializable";

export default interface IComponent<T> extends ISerializable {
	readonly isComponent: boolean;
	id: number;
	data: T;
	disabled: boolean;
	name: string;
	usedBy: IComponentManager[];
	dirty: boolean;

	clone(): IComponent<T>;
}
