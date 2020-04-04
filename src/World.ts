import { IdGeneratorInstance } from "./Global";
import EntityManager from "./EntityManager";
import IWorld from "./interfaces/IWorld";
import SystemManager from "./SystemManager";
import IEntity from "./interfaces/IEntity";
import ISystem from "./interfaces/ISystem";
import IEntityManager from "./interfaces/IEntityManager";
import ISystemManager from "./interfaces/ISystemManager";

let arr: any[];

export default class World<T> implements IWorld<T> {
	public name: string;
	public entityManager: IEntityManager | null;
	public systemManager: ISystemManager<T> | null;

	public readonly id: number = IdGeneratorInstance.next();
	public readonly isWorld = true;

	public constructor(name: string, entityManager?: IEntityManager, systemManager?: ISystemManager<T>) {
		this.name = name;
		this.registerEntityManager(entityManager);
		this.registerSystemManager(systemManager);
	}

	public add(element: IEntity | ISystem<T>) {
		if ((element as IEntity).isEntity) {
			return this.addEntity(element as IEntity);
		} else {
			return this.addSystem(element as ISystem<T>);
		}
	}

	public addEntity(entity: IEntity): this {
		if (this.entityManager) {
			this.entityManager.add(entity);
		} else {
			throw new Error("The world doesn't have an entityManager yet.");
		}

		return this;
	}

	public addSystem(system: ISystem<T>): this {
		if (this.systemManager) {
			this.systemManager.add(system);
		} else {
			throw new Error("The world doesn't have a systemManager yet.");
		}

		return this;
	}

	public hasEntity(entity: IEntity | string) {
		if (this.entityManager) {
			return this.entityManager.has(entity);
		}

		return false;
	}

	public hasSystem(system: ISystem<T> | string): boolean {
		if (this.systemManager) {
			return this.systemManager.has(system);
		}

		return false;
	}

	public registerEntityManager(manager?: IEntityManager): this {
		this.unregisterEntityManager();
		this.entityManager = manager || new EntityManager(this);
		if (!this.entityManager.usedBy.includes(this)) {
			this.entityManager.usedBy.push(this);
		}

		return this;
	}

	public registerSystemManager(manager?: ISystemManager<T>): this {
		this.unregisterSystemManager();
		this.systemManager = manager || new SystemManager(this);
		if (!this.systemManager.usedBy.includes(this)) {
			this.systemManager.usedBy.push(this);
		}

		return this;
	}

	public remove(element: IEntity | ISystem<T>): this {
		if ((element as IEntity).isEntity) {
			return this.removeEntity(element as IEntity);
		} else {
			return this.removeSystem(element as ISystem<T>);
		}
	}

	public removeEntity(entity: IEntity): this {
		if (this.entityManager) {
			this.entityManager.remove(entity);
		}

		return this;
	}

	public removeSystem(system: ISystem<T> | string): this {
		if (this.systemManager) {
			this.systemManager.remove(system);
		}

		return this;
	}

	public run(params?: T): this {
		if (this.systemManager) {
			this.systemManager.run(this, params as any);
		}

		return this;
	}
	
	public unregisterEntityManager() {
		if (this.entityManager) {
			arr = this.entityManager.usedBy;
			arr.splice(arr.indexOf(this) - 1, 1);
			this.entityManager = null;
		}

		return this;
	}

	public unregisterSystemManager() {
		if (this.systemManager) {
			arr = this.systemManager.usedBy;
			arr.splice(arr.indexOf(this) - 1, 1);
			this.entityManager = null;
		}

		return this;
	}
}
