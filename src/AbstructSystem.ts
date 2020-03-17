import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IQuery from "./interfaces/IQuery";
import ISystem from "./interfaces/ISystem";
import Query from "./Query";

export abstract class AbstructSystem implements ISystem {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isSystem = true;
	public name: string;
	public query: IQuery = new Query();
	public abstract fit(entity: IEntity): boolean;
	public abstract run(...args: any[]): any;
	public abstract destroy(): void;
}
