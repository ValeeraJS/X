import { Entity, EntityConstructor } from "./Entity";
import { System, SystemConstructor } from "./System";
export declare class World {
    disabled: boolean;
    name: string;
    entities: Map<number, Entity>;
    systems: Map<number, System>;
    readonly id: number;
    readonly isWorld = true;
    constructor(name?: string);
    add(element: Entity | System): this;
    addEntity(entity: Entity): this;
    addSystem(system: System): this;
    clear(): this;
    clearEntities(): this;
    clearSystems(): this;
    createEntity(name: string): Entity;
    destroy(): this;
    getEntity(entity: number | string | EntityConstructor): Entity | null;
    getSystem(system: number | string | SystemConstructor): System | null;
    hasEntity(entity: Entity | string | number): boolean;
    hasSystem(system: System | string | number | SystemConstructor): boolean;
    remove(element: Entity | System | SystemConstructor): this;
    removeEntity(entity: Entity | number | string | EntityConstructor): this;
    removeSystem(system: System | string | number | SystemConstructor): this;
    rootEntities(): Entity[];
    run(time: number, delta: number): this;
    updateOrder(): this;
}
