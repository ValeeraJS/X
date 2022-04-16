import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import IWorld from "./interfaces/IWorld";
import TreeNodeWithEvent from "./TreeNodeWithEvent";
export default class Entity extends TreeNodeWithEvent implements IEntity {
    readonly id: number;
    readonly isEntity = true;
    componentManager: IComponentManager | null;
    name: string;
    usedBy: IEntityManager[];
    constructor(name?: string, componentManager?: IComponentManager);
    addComponent(component: IComponent<any>): this;
    addChild(entity: IEntity): this;
    addTo(manager: IEntityManager): this;
    addToWorld(world: IWorld): this;
    getComponent(name: string): IComponent<any> | null;
    hasComponent(component: IComponent<any> | string): boolean;
    registerComponentManager(manager?: IComponentManager): this;
    removeChild(entity: IEntity): this;
    removeComponent(component: IComponent<any> | string): this;
    unregisterComponentManager(): this;
}
