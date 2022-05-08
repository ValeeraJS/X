import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import Manager from "./Manager";
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
export default class ComponentManager extends Manager<IComponent<any>> implements IComponentManager {
    isComponentManager: boolean;
    add(element: IComponent<any>): this;
    getComponentsByTagLabel(label: string): IComponent<any>[];
    private checkedComponentsWithTargetTags;
}
