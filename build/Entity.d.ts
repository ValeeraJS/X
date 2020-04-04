import IComponent from "./interfaces/IComponent";
import IEntity from "./interfaces/IEntity";
import IWorld from "./interfaces/IWorld";
import IEntityManager from "./interfaces/IEntityManager";
import EventDispatcher from "@valeera/eventdispatcher";
import IComponentManager from "./interfaces/IComponentManager";
export default class Entity extends EventDispatcher implements IEntity {
    readonly id: number;
    readonly isEntity = true;
    componentManager: IComponentManager | null;
    name: string;
    usedBy: IEntityManager[];
    constructor(name: string, componentManager?: IComponentManager);
    addComponent(component: IComponent): this;
    addTo(manager: IEntityManager): this;
    addToWorld(world: IWorld<any>): this;
    getComponent(name: string): IComponent | null;
    hasComponent(component: IComponent | string): boolean;
    registerComponentManager(manager?: IComponentManager): this;
    removeComponent(component: IComponent | string): this;
    unregisterComponentManager(): this;
}
