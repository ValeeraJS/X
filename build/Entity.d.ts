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
    disabled: boolean;
    name: string;
    usedBy: IEntityManager[];
    constructor(name?: string, componentManager?: IComponentManager);
    addComponent(component: IComponent<any>): this;
    addChild(entity: IEntity): this;
    addTo(manager: IEntityManager): this;
    addToWorld(world: IWorld): this;
    destroy(): void;
    getComponent(nameOrId: string | number): IComponent<any> | null;
    getComponentsByTagLabel(label: string): IComponent<any>[];
    getFirstComponentByTagLabel(label: string): IComponent<any> | null;
    hasComponent(component: IComponent<any> | string | number): boolean;
    registerComponentManager(manager?: IComponentManager): this;
    removeChild(entity: IEntity): this;
    removeComponent(component: IComponent<any> | string): this;
    serialize(): any;
    unregisterComponentManager(): this;
}
