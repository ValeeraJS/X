import EventFirer from "@valeera/eventdispatcher/src/EventFirer";
import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IECSObject from "./interfaces/IECSObject";
import IManager from "./interfaces/IManager";
export declare enum EElementChangeEvent {
    ADD = "add",
    REMOVE = "remove"
}
export interface EventObject {
    eventKey: EElementChangeEvent;
    manager: IComponentManager;
    component: IComponent<any>;
    element: IComponent<any>;
}
export default class Manager<T extends IECSObject> extends EventFirer implements IManager<T> {
    static readonly Events: typeof EElementChangeEvent;
    elements: Map<string, T>;
    disabled: boolean;
    usedBy: any[];
    readonly isManager = true;
    addElement(component: T): this;
    addElementDirect(component: T): this;
    clear(): this;
    get(name: string): T | null;
    has(component: T | string): boolean;
    removeElement(component: T | string): this;
    removeElementByName(name: string): this;
    removeElementByInstance(component: T): this;
    private elementChangeDispatch;
}
