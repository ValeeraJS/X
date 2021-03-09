import IComponent from "./interfaces/IComponent";

export default class Component<T> implements IComponent<T> {
	public readonly isComponent = true;
	public data: T | null = null;
	public disabled = false;
	public name: string;
	public usedBy = [];
	public dirty = false;

	public constructor(name: string, data: T | null = null) {
		this.name = name;
		this.data = data;
	}

	public clone(): IComponent<T> {
		return new Component(this.name, this.data);
	}
}
