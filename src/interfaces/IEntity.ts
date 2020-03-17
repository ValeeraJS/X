import IComponentManager from "./IComponentManager";
import IWorld from "./IWorld";

export default interface IEntity extends IComponentManager {
	readonly id: number;
	readonly isEntity: true;
	world: IWorld | null;
}
