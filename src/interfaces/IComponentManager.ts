import IComponent from "./IComponent";

export default interface IComponentManager {
	components: Map<string, IComponent>;
	addComponent: (component: IComponent) => this;
	getComponent: (name: string) => IComponent | null;
	hasComponent: (component: IComponent) => boolean;
	isMixedFrom: (entity: IComponentManager) => boolean;
	mixComponentsFrom: (entity: IComponentManager) => this;
	removeComponent: (component: IComponent) => this;
}
