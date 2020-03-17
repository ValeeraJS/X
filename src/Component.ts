import IComponent from "./interfaces/IComponent";

export default class Component implements IComponent {
	public readonly isComponent = true;
	public data: any = null;
	public disabled = false;
	public name: string;
	public usedBy = [];

	public constructor(name: string, data: any) {
		this.name = name;
		this.data = data;
	}
}
