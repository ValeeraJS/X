import IEntity from "./IEntity";

export default interface IQuery {
	entities: IEntity[];
	add: (entity: IEntity) => this;
	remove: (entity: IEntity) => this;
}
