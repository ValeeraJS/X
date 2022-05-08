import IComponent from "./IComponent";
import IEntity from "./IEntity";
import IManager from "./IManager";
export default interface IComponentManager extends IManager<IComponent<any>> {
    readonly isComponentManager: boolean;
    usedBy: IEntity[];
    getComponentsByTagLabel(label: string): IComponent<any>[];
}
