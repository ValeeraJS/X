import { Entity } from "./Entity";
import { IdGeneratorInstance } from "./Global";
import { IECSObject } from "./interfaces/IECSObject";

export class Component<DataType> implements IECSObject<Entity> {
	public readonly isComponent = true;
	public readonly id = IdGeneratorInstance.next();
	public data: DataType | null = null;
	public disabled = false;
	public name: string;
	public usedBy: Entity[] = [];

	public constructor(data: DataType | null = null, name: string = "Untitled Component") {
		this.name = name;
		this.data = data;
	}

	public clone(): Component<DataType> {
		return new Component(structuredClone(this.data), this.name);
	}

	public destroy() {
		this.usedBy.forEach((manager) => {
			manager.remove(this);
		});
		this.data = null;
	}
}

export type ComponentConstructor<DataType> = new (...args: any[]) => Component<DataType>;
