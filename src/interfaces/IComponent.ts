import IComponentManager from "./IComponentManager";

export default interface IComponent {
	readonly isComponent: true;
	data: any;
	disabled: boolean;
	name: string;
	usedBy: IComponentManager[];
}
