import IWorld, { TWorldInjection } from "./IWorld";
import IEntity from "./IEntity";
import IEntityManager from "./IEntityManager";
import ISystemManager from "./ISystemManager";
export default interface ISystem {
    readonly id: number;
    disabled: boolean;
    entitySet: WeakMap<IEntityManager, Set<IEntity>>;
    loopTimes: number;
    name: string;
    usedBy: ISystemManager[];
    checkEntityManager(entityManager: IEntityManager): this;
    checkUpdatedEntities(manager: IEntityManager | null): this;
    query(entity: IEntity): boolean;
    handle(entity: IEntity, params: TWorldInjection): this;
    run(world: IWorld): this;
}
