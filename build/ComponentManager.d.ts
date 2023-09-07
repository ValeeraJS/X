import { IComponent } from "./interfaces/IComponent";
import { IComponentManager } from "./interfaces/IComponentManager";
import { Manager } from "./Manager";
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
export declare class ComponentManager extends Manager<IComponent<any>> implements IComponentManager {
    isComponentManager: boolean;
    add(element: IComponent<any>): this;
    getComponentsByClass<T extends IComponent<any>>(clazz: new () => T): T[];
    getComponentByClass<T extends IComponent<any>>(clazz: new () => T): T | null;
    getComponentsByTagLabel(label: string): IComponent<any>[];
    getComponentByTagLabel(label: string): IComponent<any> | null;
    private checkedComponentsWithTargetTags;
}
