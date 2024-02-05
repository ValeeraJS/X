import { EventFirer } from "@valeera/eventfire";
import type { Entity } from "./Entity";
import { EntityManager } from "./EntityManager";
import { IWorldSerializedJson } from "./interfaces/ISerializable";
import { System, SystemConstructor } from "./System";
import { SystemManager } from "./SystemManager";
export declare class World extends EventFirer {
    disabled: boolean;
    name: string;
    entityManager: EntityManager;
    systemManager: SystemManager;
    usedBy: any[];
    readonly id: number;
    readonly isWorld = true;
    constructor(name?: string);
    add(element: Entity | System): this;
    addEntity(entity: Entity): this;
    addSystem(system: System): this;
    clearAllEntities(): this;
    clearAllSystems(): this;
    createEntity(name: string): Entity;
    hasEntity(entity: Entity | string | number): boolean;
    hasSystem(system: System | string | number | SystemConstructor): boolean;
    remove(element: Entity | System | SystemConstructor): this;
    removeEntity(entity: Entity | number | string | (new (...args: any[]) => Entity)): this;
    removeSystem(system: System | string | number | SystemConstructor): this;
    run(time: number, delta: number): this;
    serialize(): IWorldSerializedJson;
}
