import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IECSObject from "./interfaces/IECSObject";
import IEntity from "./interfaces/IEntity";
import IManager from "./interfaces/IManager";
export declare enum EComponentEvent {
    ADD = "add",
    REMOVE = "remove"
}
export interface EventObject {
    eventKey: EComponentEvent;
    manager: IComponentManager;
    component: IComponent<any>;
    element: IComponent<any>;
}
export default class Manager<T extends IECSObject> implements IManager<T> {
    static readonly Events: typeof EComponentEvent;
    elements: Map<string, T>;
    disabled: boolean;
    usedBy: IEntity[];
    readonly isManager = true;
    add(component: T): this;
    addComponentDirect(component: T): this;
    clear(): this;
    get(name: string): T | null;
    has(component: T | string): boolean;
    remove(component: T | string): this;
    removeByName(name: string): this;
    removeByInstance(component: T): this;
    private entityComponentChangeDispatch;
}
