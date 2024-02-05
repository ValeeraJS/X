import { IEntity } from "./IEntity";
import { IManager } from "./IManager";
import { IWorld } from "./IWorld";

export interface IEntityManager extends IManager<IEntity, IWorld> {
	readonly isEntityManager: boolean;
	updatedEntities: Set<IEntity>;
	usedBy: IWorld;

	createEntity: (name: string) => IEntity;
}
