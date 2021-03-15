import IWorld, { TWorldInjection } from "./interfaces/IWorld";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
declare type TQueryRule = (entity: IEntity) => boolean;
export default abstract class ASystem implements ISystem {
    readonly id: number;
    readonly isSystem = true;
    name: string;
    disabled: boolean;
    loopTimes: number;
    entitySet: WeakMap<IEntityManager, Set<IEntity>>;
    usedBy: ISystemManager[];
    private queryRule;
    constructor(name: string, fitRule: TQueryRule);
    checkUpdatedEntities(manager: IEntityManager | null): this;
    checkEntityManager(manager: IEntityManager | null): this;
    query(entity: IEntity): boolean;
    run(world: IWorld): this;
    abstract destroy(): void;
    abstract handle(entity: IEntity, params: TWorldInjection): this;
}
export {};
