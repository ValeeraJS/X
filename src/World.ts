import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IWorld from "./interfaces/IWorld";

export default class World implements IWorld {
	public name: string;
	public entities: IEntity[];
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isWorld = true;

	public constructor(name: string) {
		this.name = name;
	}

	public run(time: number): this {
		return this;
	}
}
