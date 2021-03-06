import IEntity from "./IEntity";
import IManager from "./IManager";
import IWorld from "./IWorld";

export default interface IEntityManager extends IManager<IEntity> {
	readonly isEntityManager: true;
	updatedEntities: Set<IEntity>;
	usedBy: IWorld<any>[];
}
