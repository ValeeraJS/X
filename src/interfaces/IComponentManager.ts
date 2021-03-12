import IComponent from "./IComponent";
import IEntity from "./IEntity";
import IManager from "./IManager";

export default interface IComponentManager extends IManager<IComponent<any>> {
	readonly isComponentManager: true;
	usedBy: IEntity[];
	isMixedFrom: (entity: IComponentManager) => boolean;
	mixFrom: (entity: IComponentManager) => this;
}
