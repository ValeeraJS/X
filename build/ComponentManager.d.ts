import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IEntity from "./interfaces/IEntity";
export declare enum EComponentEvent {
    ADD_COMPONENT = "addComponent",
    REMOVE_COMPONENT = "removeComponent"
}
export interface ComponentEventObject {
    eventKey: EComponentEvent;
    manager: IComponentManager;
    component: IComponent<any>;
    target: IComponent<any>;
}
export default class ComponentManager implements IComponentManager {
    private static readonly ADD_COMPONENT;
    private static readonly REMOVE_COMPONENT;
    private static eventObject;
    elements: Map<string, IComponent<any>>;
    disabled: boolean;
    usedBy: IEntity[];
    readonly isComponentManager = true;
    add(component: IComponent<any>): this;
    addComponentDirect(component: IComponent<any>): this;
    clear(): this;
    get(name: string): IComponent<any> | null;
    has(component: IComponent<any> | string): boolean;
    isMixedFrom(componentManager: IComponentManager): boolean;
    mixFrom(componentManager: IComponentManager): this;
    remove(component: IComponent<any> | string): this;
    removeByName(name: string): this;
    removeByInstance(component: IComponent<any>): this;
    private entityComponentChangeDispatch;
}
