import { ComponentTag } from "./interfaces/IComponent";
import { IdGeneratorInstance } from "./Global";
import { IComponentSerializedJson } from "./interfaces/ISerializable";
import { ComponentManager } from "./ComponentManager";
import { EventFirer } from "@valeera/eventfire";

export type ComponentConstructor<T> = new (...args: any[]) => Component<T>;

export class Component<T> extends EventFirer {
	public static unserialize<T>(json: IComponentSerializedJson<T>): Component<T> {
		const component = new Component(json.data, json.tags, json.name);
		component.disabled = json.disabled;

		return component;
	}

	public readonly isComponent = true;
	public readonly id = IdGeneratorInstance.next();
	public data: T | null = null;
	public disabled = false;
	public name: string;
	public usedBy: ComponentManager[] = [];
	public tags: ComponentTag[];
	#dirty = false;

	public get dirty(): boolean {
		return this.#dirty;
	}

	public set dirty(v: boolean) {
		this.#dirty = v;
	}

	public constructor(data: T | null = null, tags: ComponentTag[] = [], name: string = "Untitled Component") {
		super();
		this.name = name;
		this.data = data;
		this.tags = tags;
	}

	public clone(): Component<T> {
		return new Component(structuredClone(this.data), this.tags, this.name);
	}

	public destroy() {
		this.usedBy.forEach((manager) => {
			manager.usedBy.remove(this);
		});
		this.data = null;
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

	public serialize(): IComponentSerializedJson<T | null> {
		return {
			class: "Component",
			data: this.data,
			disabled: this.disabled,
			id: this.id,
			name: this.name,
			tags: this.tags,
		};
	}
}
