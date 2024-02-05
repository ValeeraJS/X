import { EventFirer } from "@valeera/eventfire";
import type { Entity } from "./Entity";
import { EntityManager } from "./EntityManager";
import { IdGeneratorInstance } from "./Global";
import { IWorldSerializedJson } from "./interfaces/ISerializable";
import { System, SystemConstructor } from "./System";
import { SystemManager } from "./SystemManager";

export class World extends EventFirer {
	public disabled = false;
	public name: string;
	public entityManager: EntityManager = new EntityManager(this);
	public systemManager: SystemManager = new SystemManager(this);
	public usedBy: any[] = [];

	public readonly id: number = IdGeneratorInstance.next();
	public readonly isWorld = true;

	public constructor(name?: string) {
		super();
		this.name = name ?? this.constructor.name;
	}

	public add(element: Entity | System): this {
		if ((element as Entity).isEntity) {
			return this.addEntity(element as Entity);
		} else {
			return this.addSystem(element as System);
		}
	}

	public addEntity(entity: Entity): this {
		this.entityManager.add(entity);

		return this;
	}

	public addSystem(system: System): this {
		this.systemManager.add(system);

		return this;
	}

	public clearAllEntities(): this {
		this.entityManager.clear();

		return this;
	}

	public clearAllSystems(): this {
		this.systemManager.clear();

		return this;
	}

	public createEntity(name: string): Entity {
		return this.entityManager.createEntity(name);
	}

	public hasEntity(entity: Entity | string | number): boolean {
		return this.entityManager.has(entity);
	}

	public hasSystem(system: System | string | number | SystemConstructor): boolean {
		return this.systemManager.has(system);
	}

	public remove(element: Entity | System | SystemConstructor): this {
		if (element instanceof System || typeof element === "function") {
			return this.removeSystem(element);
		} else {
			return this.removeEntity(element);
		}
	}

	public removeEntity(entity: Entity | number | string | (new (...args: any[]) => Entity)): this {
		this.entityManager.remove(entity);

		return this;
	}

	public removeSystem(system: System | string | number | SystemConstructor): this {
		this.systemManager.remove(system);

		return this;
	}

	public run(time: number, delta: number): this {
		if (this.disabled) {
			return this;
		}
		this.systemManager.run(this, time, delta);

		return this;
	}

	public serialize(): IWorldSerializedJson {
		return {
			id: this.id,
			name: this.name,
			type: "world",
			class: this.constructor.name,
			disabled: this.disabled,
			systems: [],
			entities: [],
		};
	}
}
