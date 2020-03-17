import IEntity from "./IEntity";

export default interface IComponent {
	readonly isComponent: true;
	data: any;
	disabled: boolean;
	name: string;
	usedBy: IEntity[];
}
