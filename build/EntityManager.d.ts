import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { World } from "./World";
export declare class EntityManager extends Manager<Entity, World> {
    data: any;
    updatedEntities: Set<Entity>;
    readonly isEntityManager = true;
    createEntity(name: string): Entity;
    protected addElementDirectly(entity: Entity): this;
    protected removeElementDirectly(entity: Entity): this;
    private deleteEntityFromSystemSet;
}
