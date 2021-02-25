import IComponent from "./interfaces/IComponent";

export default class Component<T> implements IComponent<T> {
	public readonly isComponent = true;
	public data: any = null;
	public disabled = false;
	public name: string;
	public usedBy = [];

	public constructor(name: string, data: any) {
		this.name = name;
		this.data = data;
	}

	clone() {
		return new Component(this.name, this.data);
	}
}
