import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
export default class World<T> implements IWorld<T> {
    name: string;
    entityManager: IEntityManager | null;
    systemManager: ISystemManager<T> | null;
    readonly id: number;
    readonly isWorld = true;
    constructor(name: string, entityManager?: IEntityManager, systemManager?: ISystemManager<T>);
    add(element: IEntity | ISystem<T>): this;
    addEntity(entity: IEntity): this;
    addSystem(system: ISystem<T>): this;
    hasEntity(entity: IEntity | string): boolean;
    hasSystem(system: ISystem<T> | string): boolean;
    registerEntityManager(manager?: IEntityManager): this;
    registerSystemManager(manager?: ISystemManager<T>): this;
    remove(element: IEntity | ISystem<T>): this;
    removeEntity(entity: IEntity): this;
    removeSystem(system: ISystem<T> | string): this;
    run(params?: T): this;
    unregisterEntityManager(): this;
    unregisterSystemManager(): this;
}
