import IComponentManager from "./IComponentManager";

export default interface IComponent<T> {
	readonly isComponent: true;
	data: T;
	disabled: boolean;
	name: string;
	usedBy: IComponentManager[];

	clone(): IComponent<T>;
}
