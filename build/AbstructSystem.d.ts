import IEntity from "./interfaces/IEntity";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import IEntityManager from "./interfaces/IEntityManager";
declare type TFitRule = (entity: IEntity) => boolean;
export default abstract class AbstructSystem<T> implements ISystem<T> {
    readonly id: number;
    readonly isSystem = true;
    name: string;
    disabled: boolean;
    loopTimes: number;
    entitySet: Set<IEntity>;
    usedBy: ISystemManager<T>[];
    private fitRule;
    constructor(name: string, fitRule: TFitRule);
    fit(entity: IEntity): boolean;
    abstract destroy(): void;
    abstract handle(entity: IEntity, params?: T): this;
    checkUpdatedEntities(manager: IEntityManager | null): this;
    run(world: IWorld<T>, params: T): this;
}
export {};
