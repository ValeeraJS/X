import IEntity from "./IEntity";
import IEntityManager from "./IEntityManager";
import ISystemManager from "./ISystemManager";
import IWorld from "./IWorld";
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
