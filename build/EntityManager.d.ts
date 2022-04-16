import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import IWorld from "./interfaces/IWorld";
import Manager from "./Manager";
export default class EntityManager extends Manager<IEntity> implements IEntityManager {
    data: any;
    updatedEntities: Set<IEntity>;
    readonly isEntityManager = true;
    constructor(world?: IWorld);
    addElementDirect(entity: IEntity): this;
    createEntity(name: string): IEntity;
    removeElementByName(name: string): this;
    removeElementByInstance(entity: IEntity): this;
    private deleteEntityFromSystemSet;
}
