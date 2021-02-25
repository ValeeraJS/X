import ISystemManager from "./ISystemManager";
import IEntity from "./IEntity";
import IWorld from "./IWorld";
import IEntityManager from "./IEntityManager";

export default interface ISystem<T> {
	readonly id: number;
	disabled: boolean;
	entitySet: WeakMap<IEntityManager, Set<IEntity>>;
	loopTimes: number;
	name: string;
	usedBy: ISystemManager<T>[];

	checkEntityManager: (entityManager: IEntityManager) => this;
	checkUpdatedEntities: (manager: IEntityManager | null) => this;
	query: (entity: IEntity) => boolean;
	handle: (entity: IEntity, params?: T) => this;
	run: (world: IWorld<T>, params?: T) => this;
}
