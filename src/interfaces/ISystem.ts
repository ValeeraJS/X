import { IECSObject } from "./IECSObject";
import { IEntity } from "./IEntity";
import { IEntityManager } from "./IEntityManager";
import { ISystemManager } from "./ISystemManager";
import { IWorld } from "./IWorld";

export interface ISystem extends IECSObject<ISystem> {
	entitySet: WeakMap<IEntityManager, Set<IEntity>>;
	loopTimes: number;
	usedBy: ISystemManager[];
	cache: WeakMap<IEntity, any>;
	autoUpdate: boolean;
	priority: number;

	set disabled(disabled: boolean);
	get disabled(): boolean;

	checkEntityManager(entityManager: IEntityManager): this;
	checkUpdatedEntities(manager: IEntityManager | null): this;
	destroy(): this;
	query(entity: IEntity): boolean;
	handle(entity: IEntity, time: number, delta: number, world: IWorld): this;
	run(world: IWorld, time: number, delta: number): this;
}
