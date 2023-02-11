import EventFirer from "@valeera/eventfirer";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
type TQueryRule = (entity: IEntity) => boolean;
export default abstract class System extends EventFirer implements ISystem {
    readonly id: number;
    readonly isSystem = true;
    name: string;
    loopTimes: number;
    entitySet: WeakMap<IEntityManager, Set<IEntity>>;
    usedBy: ISystemManager[];
    cache: WeakMap<IEntity, any>;
    protected rule: TQueryRule;
    protected _disabled: boolean;
    get disabled(): boolean;
    set disabled(value: boolean);
    constructor(name: string | undefined, fitRule: TQueryRule);
    checkUpdatedEntities(manager: IEntityManager | null): this;
    checkEntityManager(manager: IEntityManager | null): this;
    query(entity: IEntity): boolean;
    run(world: IWorld, time: number, delta: number): this;
    serialize(): any;
    destroy(): this;
    abstract handle(entity: IEntity, time: number, delta: number): this;
}
export {};
