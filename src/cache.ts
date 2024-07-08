import type { Entity } from "./Entity";
import type { System } from "./System";
import type { World } from "./World";

export const EntitiesCache = new WeakMap<World, Set<Entity>>();
export const SystemOrderCache = new WeakMap<World, System[]>();
