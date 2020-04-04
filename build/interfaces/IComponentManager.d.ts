import IComponent from "./IComponent";
import IManager from "./IManager";
import IEntity from "./IEntity";
export default interface IComponentManager extends IManager<IComponent> {
    readonly isComponentManager: true;
    usedBy: IEntity[];
    isMixedFrom: (entity: IComponentManager) => boolean;
    mixFrom: (entity: IComponentManager) => this;
}
