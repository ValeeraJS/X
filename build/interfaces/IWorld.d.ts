import { IECSObject } from "./IECSObject";
import { IEntity } from "./IEntity";
import { IEntityManager } from "./IEntityManager";
import { ISystem } from "./ISystem";
import { ISystemManager } from "./ISystemManager";
export type TWorldInjection = Map<string, any>;
export interface IWorld extends IECSObject<any> {
    entityManager: IEntityManager | null;
    store: TWorldInjection;
    systemManager: ISystemManager | null;
    addEntity(entity: IEntity): this;
    addSystem(system: ISystem): this;
    hasEntity(entity: IEntity | string): boolean;
    hasSystem(system: ISystem | string): boolean;
    removeEntity(entity: IEntity): this;
    removeSystem(system: ISystem): this;
    run(time: number, delta: number): this;
}
