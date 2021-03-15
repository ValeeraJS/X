import IEntity from "./IEntity";
import IEntityManager from "./IEntityManager";
import ISystem from "./ISystem";
import ISystemManager from "./ISystemManager";

export default interface IWorld<T> {
	name: string;
	entityManager: IEntityManager | null;
	systemManager: ISystemManager<T> | null;

	addEntity(entity: IEntity): this;
	addSystem(system: ISystem<T>): this;
	hasEntity(entity: IEntity | string): boolean;
	hasSystem(system: ISystem<T> | string): boolean;
	removeEntity(entity: IEntity): this;
	removeSystem(system: ISystem<T>): this;
	run(params?: T): this;
}
