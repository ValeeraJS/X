import IComponentManager from "./IComponentManager";
import ISerializable from "./ISerializable";

export default interface IComponent<T> extends ISerializable {
	readonly isComponent: true;
	id: number;
	data: T | null;
	disabled: boolean;
	name: string;
	usedBy: IComponentManager[];
	dirty: boolean;

	clone(): IComponent<T>;
}
