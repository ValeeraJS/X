import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
export default class World implements IWorld {
    name: string;
    entityManager: IEntityManager | null;
    systemManager: ISystemManager | null;
    store: Map<string, any>;
    readonly id: number;
    readonly isWorld = true;
    constructor(name: string, entityManager?: IEntityManager, systemManager?: ISystemManager);
    add(element: IEntity | ISystem): this;
    addEntity(entity: IEntity): this;
    addSystem(system: ISystem): this;
    hasEntity(entity: IEntity | string): boolean;
    hasSystem(system: ISystem | string): boolean;
    registerEntityManager(manager?: IEntityManager): this;
    registerSystemManager(manager?: ISystemManager): this;
    remove(element: IEntity | ISystem): this;
    removeEntity(entity: IEntity): this;
    removeSystem(system: ISystem | string): this;
    run(): this;
    unregisterEntityManager(): this;
    unregisterSystemManager(): this;
}
