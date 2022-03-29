import IEntity from "./IEntity";
import IEntityManager from "./IEntityManager";
import ISystem from "./ISystem";
import ISystemManager from "./ISystemManager";
export declare type TWorldInjection = Map<string, any>;
export default interface IWorld {
    name: string;
    entityManager: IEntityManager | null;
    store: TWorldInjection;
    systemManager: ISystemManager | null;
    addEntity(entity: IEntity): this;
    addSystem(system: ISystem): this;
    hasEntity(entity: IEntity | string): boolean;
    hasSystem(system: ISystem | string): boolean;
    removeEntity(entity: IEntity): this;
    removeSystem(system: ISystem): this;
    run(): this;
}
