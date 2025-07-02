import { EntitiesCache, SystemOrderCache } from "./cache";
import { Entity, EntityConstructor } from "./Entity";
import { IdGeneratorInstance } from "./Global";
import { System, SystemConstructor } from "./System";
import { add, clear, get, has, remove } from "./utils/ecsManagerOperations";
import { unsortedRemove } from "./utils/unsortedRemove";

const sort = (a: System, b: System) => a.priority - b.priority;

export class World {
	public disabled = false;
	public name: string;
	public entities = new Map<number, Entity>();
	public systems = new Map<number, System>();

	public readonly id: number = IdGeneratorInstance.next();
	public readonly isWorld = true;

	public constructor(name?: string) {
		this.name = name ?? this.constructor.name;
		EntitiesCache.set(this, new Set());
		SystemOrderCache.set(this, []);
	}

	public add<T extends EntityConstructor>(element: T, ...args: ConstructorParameters<T>): this;
	public add<T extends SystemConstructor>(element: T, ...args: ConstructorParameters<T>): this;
	public add(element: Entity | System): this;
	public add(element: Entity | System | EntityConstructor | SystemConstructor, ...args: any[]): this {
		if (element instanceof Entity) {
			return this.addEntity(element as Entity);
		} else if (element instanceof System) {
			return this.addSystem(element as System);
		}
		
		return this.add(new element(...args));
	}

	public addEntity<T extends EntityConstructor>(entity: T, ...args: ConstructorParameters<T>): this
	public addEntity(entity: Entity): this;
	public addEntity<T extends EntityConstructor>(entity: Entity | T, ...args: ConstructorParameters<T>): this {
		const e = entity instanceof Entity ? entity : new entity(...args);
		add(e, this.entities, this as World);
		EntitiesCache.get(this).add(e);

		for (const child of e.children) {
			this.add(child);
		}

		return this;
	}

	public addSystem<T extends SystemConstructor>(system: T, ...args: ConstructorParameters<T>): this;
	public addSystem(system: System): this;
	public addSystem<T extends SystemConstructor>(system: System | T, ...args: ConstructorParameters<T>): this {
		const s = system instanceof System ? system : new system(...args);
		add(s, this.systems, this as World);
		s.checkEntityManager(this);

		return this.updateOrder();;
	}

	public clear(): this {
		return this.clearSystems().clearEntities();
	}

	public clearEntities(): this {
		clear(this.entities, this as World);

		return this;
	}

	public clearSystems(): this {
		clear(this.systems, this as World);

		return this;
	}

	public createEntity(name: string): Entity {
		const entity = new Entity(name);
		this.addEntity(entity);

		return entity;
	}

	public destroy(): this {
		const arr1 = Array.from(this.systems);
		for (let item of arr1) {
			if (item[1].usedBy.length === 1) {
				item[1].destroy();
			} else {
				this.removeSystem(item[1]);
			}
		}
		const arr2 = this.rootEntities();
		for (let item of arr2) {
			if (item.usedBy.length === 1) {
				item.destroy();
			} else {
				this.removeEntity(item);
			}
		}

		this.disabled = true;

		return this;
	}

	public getEntity(entity: number | string | EntityConstructor): Entity | null {
		return get(this.entities, entity);
	}

	public getSystem(system: number | string | SystemConstructor): System | null {
		return get(this.systems, system);
	}

	public hasEntity(entity: Entity | string | number): boolean {
		return has(this.entities, entity);
	}

	public hasSystem(system: System | string | number | SystemConstructor): boolean {
		return has(this.systems, system);
	}

	public remove(element: Entity | System | SystemConstructor): this {
		if (element instanceof System || typeof element === "function") {
			return this.removeSystem(element);
		} else {
			return this.removeEntity(element);
		}
	}

	public removeEntity(entity: Entity | number | string | EntityConstructor): this {
		if (typeof entity === 'number' || typeof entity === 'string' || typeof entity === 'function') {
			entity = get(this.entities, entity);
		}

		if (!entity) {
			return this;
		}

		unsortedRemove(entity.usedBy, entity.usedBy.indexOf(this));
		remove(this.entities, entity, this as World);

		this.systems.forEach((system: System) => {
			system.entitySet.get(this)!.delete(entity as Entity);
		});

		for (const child of entity.children) {
			this.remove(child);
		}

		return this;
	}

	public removeSystem(system: System | string | number | SystemConstructor): this {
		let systemTmp: System | undefined;

		if (typeof system === "number" || typeof system === "string") {
			systemTmp = get(this.systems, system);
		} else if (system instanceof System) {
			if (this.systems.has(system.id)) {
				systemTmp = system;
			}
		} else {
			for (let item of this.systems) {
				if (item[1].constructor === system) {
					systemTmp = item[1];
					break;
				}
			}
		}

		if (systemTmp) {
			systemTmp.entitySet.delete(this);
			unsortedRemove(systemTmp.usedBy, systemTmp.usedBy.indexOf(this));
			remove(this.systems, systemTmp, this as World);
		}

		return this.updateOrder();
	}

	public rootEntities(): Entity[] {
		const result: Entity[] = [];

		this.entities.forEach((entity) => {
			if (!entity.parent) {
				result.push(entity);
			}
		});

		return result;
	}

	public update(time: number, delta: number): this {
		if (this.disabled) {
			return this;
		}
		SystemOrderCache.get(this).forEach((system) => {

			const weakMapTmp = system.entitySet.get(this);
			EntitiesCache.get(this).forEach((item: Entity) => {
				if (system.query(item)) {
					weakMapTmp.add(item);
				} else {
					weakMapTmp.delete(item);
				}
			});
			if (system.autoUpdate) {
				system.update(this, time, delta);
			}
		});

		EntitiesCache.get(this).clear();

		return this;
	}

	public updateOrder() {
		const arr: System[] = [];
		this.systems.forEach((element) => {
			arr.push(element);
		});
		arr.sort(sort);
		SystemOrderCache.set(this, arr);

		return this;
	}
}
