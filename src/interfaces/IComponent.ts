import IComponentManager from "./IComponentManager";

export default interface IComponent<T> {
	readonly isComponent: true;
	data: T | null;
	disabled: boolean;
	name: string;
	usedBy: IComponentManager[];
	dirty: boolean;

	clone(): IComponent<T>;
}
