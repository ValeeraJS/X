import IEntity from "./interfaces/IEntity";
import IQuery from "./interfaces/IQuery";

export default class Query implements IQuery {
	public entities: IEntity[] = [];

	public add(entity: IEntity): this {
		this.entities.push(entity);

		return this;
	}

	public has(entity: IEntity): boolean {
		return this.entities.includes(entity);
	}

	public remove(entity: IEntity): this {
		if (this.has(entity)) {
			this.entities.splice(this.entities.indexOf(entity), 1);
		}

		return this;
	}
}
