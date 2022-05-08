import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
export default class World implements IWorld {
    disabled: boolean;
    name: string;
    entityManager: IEntityManager | null;
    systemManager: ISystemManager | null;
    store: Map<string, any>;
    usedBy: never[];
    readonly id: number;
    readonly isWorld = true;
    constructor(name?: string, entityManager?: IEntityManager, systemManager?: ISystemManager);
    add(element: IEntity | ISystem): this;
    addEntity(entity: IEntity): this;
    addSystem(system: ISystem): this;
    clearAllEntities(): this;
    createEntity(name: string): IEntity | null;
    hasEntity(entity: IEntity | string): boolean;
    hasSystem(system: ISystem | string): boolean;
    registerEntityManager(manager?: IEntityManager): this;
    registerSystemManager(manager?: ISystemManager): this;
    remove(element: IEntity | ISystem): this;
    removeEntity(entity: IEntity): this;
    removeSystem(system: ISystem | string): this;
    run(): this;
    serialize(): any;
    unregisterEntityManager(): this;
    unregisterSystemManager(): this;
}
