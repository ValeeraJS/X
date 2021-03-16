import IComponent from "./IComponent";
import IComponentManager from "./IComponentManager";
import IEntityManager from "./IEntityManager";
import IEventDispatcher from "@valeera/eventdispatcher/src/interfaces/IEventDispatcher";

export default interface IEntity extends IEventDispatcher {
	readonly id: number;
	readonly isEntity: true;
	componentManager: IComponentManager | null;
	name: string;
	usedBy: IEntityManager[];

	addComponent(component: IComponent<any>): this;
	getComponent(name: string): IComponent<any> | null;
	hasComponent(component: IComponent<any> | string): boolean;
	removeComponent(component: IComponent<any> | string): this;
}
