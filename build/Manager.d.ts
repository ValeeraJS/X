import EventFirer from "@valeera/eventdispatcher";
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
    addElement(element: T): this;
    addElementDirect(element: T): this;
    clear(): this;
    get(name: string): T | null;
    has(element: T | string): boolean;
    removeElement(element: T | string): this;
    removeElementByName(name: string): this;
    removeElementByInstance(element: T): this;
    private elementChangeDispatch;
}
