import IComponent, { ComponentTag } from "./interfaces/IComponent";
import { IdGeneratorInstance } from "./Global";
import { ISerializedJson } from "./interfaces/ISerializable";

export interface IComponentSerializedJson<T> extends ISerializedJson {
	data: T;
	name: string;
	disabled: boolean;
}

export default class Component<T> implements IComponent<T> {
	public static unserialize<T>(json: IComponentSerializedJson<T>): Component<T> {
		const component = new Component(json.name, json.data);

		component.disabled = json.disabled;

		return component;
	}

	public readonly isComponent = true;
	public readonly id = IdGeneratorInstance.next();
	public data: T;
	public disabled = false;
	public name: string;
	public usedBy = [];
	public dirty = false;
	public tags: ComponentTag[];

	public constructor(name: string, data: T, tags: ComponentTag[] = []) {
		this.name = name;
		this.data = data;
		this.tags = tags;
	}

	public clone(): IComponent<T> {
		return new Component(this.name, this.data);
	}

	public serialize(): any {
		return {
			data: this.data,
			disabled: this.disabled,
			id: this.id,
			name: this.name,
			tags: this.tags,
			type: "component"
		};
	}
}
