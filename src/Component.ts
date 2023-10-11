import { ComponentTag, IComponent } from "./interfaces/IComponent";
import { IdGeneratorInstance } from "./Global";
import { ISerializedJson } from "./interfaces/ISerializable";
import { IComponentManager } from "./interfaces/IComponentManager";

export interface IComponentSerializedJson<T> extends ISerializedJson {
	data: T;
	name: string;
	disabled: boolean;
	tags: ComponentTag[];
}

export class Component<T> implements IComponent<T> {
	public static unserialize<T>(json: IComponentSerializedJson<T>): Component<T> {
		const component = new Component(json.data, json.tags, json.name);

		component.disabled = json.disabled;

		return component;
	}

	public readonly isComponent = true;
	public readonly id = IdGeneratorInstance.next();
	public data: T;
	public disabled = false;
	public name: string;
	public usedBy: IComponentManager[] = [];
	public tags: ComponentTag[];
	#dirty = false;

	public get dirty(): boolean {
		return this.#dirty;
	}

	public set dirty(v: boolean) {
		this.#dirty = v;
	}

	public constructor(data: T, tags: ComponentTag[] = [], name: string) {
		this.name = name;
		this.data = data;
		this.tags = tags;
	}

	public clone(): IComponent<T> {
		return new Component(this.data, this.tags, this.name);
	}

	// 此处为只要tag标签相同就是同一类
	public hasTagLabel(label: string): boolean {
		for (let i = this.tags.length - 1; i > -1; i--) {
			if (this.tags[i].label === label) {
				return true;
			}
		}

		return false;
	}

	public serialize(): any {
		return {
			data: this.data,
			disabled: this.disabled,
			id: this.id,
			name: this.name,
			tags: this.tags,
			type: "component",
		};
	}
}
