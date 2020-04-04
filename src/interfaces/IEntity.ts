import IComponentManager from "./IComponentManager";
import IEntityManager from "./IEntityManager";
import IEventDispatcher from "@valeera/eventdispatcher"

export default interface IEntity extends IEventDispatcher{
	readonly id: number;
	readonly isEntity: true;
	componentManager: IComponentManager | null;
	name: string;
	usedBy: IEntityManager[];
}
