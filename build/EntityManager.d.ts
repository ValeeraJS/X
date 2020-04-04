import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import IWorld from "./interfaces/IWorld";
export default class EntityManager implements IEntityManager {
    elements: Map<string, IEntity>;
    data: any;
    disabled: boolean;
    updatedEntities: Set<IEntity>;
    readonly isEntityManager = true;
    usedBy: IWorld<any>[];
    constructor(world?: IWorld<any>);
    add(entity: IEntity): this;
    addComponentDirect(entity: IEntity): this;
    clear(): this;
    get(name: string): IEntity | null;
    has(entity: IEntity | string): boolean;
    remove(entity: IEntity | string): this;
    removeByName(name: string): this;
    removeByInstance(entity: IEntity): this;
    private deleteEntityFromSystemSet;
}
