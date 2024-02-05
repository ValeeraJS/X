import { Component } from "./Component";
import type { Entity } from "./Entity";
import { Manager } from "./Manager";
export declare enum EComponentEvent {
    ADD_COMPONENT = "addComponent",
    REMOVE_COMPONENT = "removeComponent"
}
export interface ComponentEventObject {
    eventKey: EComponentEvent;
    manager: ComponentManager;
    component: Component<any>;
    target: Component<any>;
}
export declare class ComponentManager extends Manager<Component<any>, Entity> {
    isComponentManager: boolean;
    add(element: Component<any>): this;
    getComponentsByClass<T extends Component<any>>(clazz: new (...args: any[]) => T): T[];
    getComponentsByTagLabel(label: string): Component<any>[];
    getComponentByTagLabel(label: string): Component<any> | null;
    protected addElementDirectly(element: Component<any>): this;
    protected removeElementDirectly(element: Component<any>): this;
    private checkedComponentsWithTargetTags;
}
