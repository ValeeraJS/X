import { IEntity } from "./interfaces/IEntity";
import { IEntityManager } from "./interfaces/IEntityManager";
import { IWorld } from "./interfaces/IWorld";
import { Manager } from "./Manager";
export declare class EntityManager extends Manager<IEntity> implements IEntityManager {
    data: any;
    updatedEntities: Set<IEntity>;
    readonly isEntityManager = true;
    constructor(world?: IWorld);
    createEntity(name: string): IEntity;
    protected addElementDirectly(entity: IEntity): this;
    protected removeInstanceDirectly(entity: IEntity): this;
    private deleteEntityFromSystemSet;
}
