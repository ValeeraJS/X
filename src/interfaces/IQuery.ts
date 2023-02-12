import { IEntity } from "./IEntity";

export interface IQuery {
	entities: IEntity[];
	add: (entity: IEntity) => this;
	remove: (entity: IEntity) => this;
}
