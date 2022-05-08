import IComponent from "./IComponent";
import IComponentManager from "./IComponentManager";
import IECSObject from "./IECSObject";
import IEntityManager from "./IEntityManager";
import { IEventFirer } from "@valeera/eventdispatcher";
import { ITreeNode } from "@valeera/tree";
export default interface IEntity extends IEventFirer<any>, IECSObject<IEntity>, ITreeNode {
    readonly isEntity: boolean;
    componentManager: IComponentManager | null;
    usedBy: IEntityManager[];
    addComponent(component: IComponent<any>): this;
    getComponent(name: string): IComponent<any> | null;
    hasComponent(component: IComponent<any> | string): boolean;
    removeComponent(component: IComponent<any> | string): this;
}
