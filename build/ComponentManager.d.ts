import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IEntity from "./interfaces/IEntity";
export declare enum EComponentEvent {
    ADD_COMPONENT = "addComponent",
    REMOVE_COMPONENT = "removeComponent"
}
export declare type ComponentEventObject = {
    type: EComponentEvent;
    manager: ComponentManager;
    component: IComponent;
};
export default class ComponentManager implements IComponentManager {
    elements: Map<string, IComponent>;
    disabled: boolean;
    usedBy: IEntity[];
    readonly isComponentManager = true;
    private static readonly ADD_COMPONENT;
    private static readonly REMOVE_COMPONENT;
    private static eventObject;
    add(component: IComponent): this;
    addComponentDirect(component: IComponent): this;
    clear(): this;
    get(name: string): IComponent | null;
    has(component: IComponent | string): boolean;
    isMixedFrom(componentManager: IComponentManager): boolean;
    mixFrom(componentManager: IComponentManager): this;
    remove(component: IComponent | string): this;
    removeByName(name: string): this;
    removeByInstance(component: IComponent): this;
    private entityComponentChangeDispatch;
}
