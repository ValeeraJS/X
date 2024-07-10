import type { Entity } from "./Entity";
import type { System } from "./System";
import type { World } from "./World";
export declare const EntitiesCache: WeakMap<World, Set<Entity>>;
export declare const SystemOrderCache: WeakMap<World, System[]>;
