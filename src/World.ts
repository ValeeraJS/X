import EntityManager from "./EntityManager";
import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import SystemManager from "./SystemManager";

let arr: any[];

export default class World implements IWorld {
	public name: string;
	public entityManager: IEntityManager | null = null;
	public systemManager: ISystemManager | null = null;
	public store: Map<string, any> = new Map();

	public readonly id: number = IdGeneratorInstance.next();
	public readonly isWorld = true;

	public constructor(name = "", entityManager?: IEntityManager, systemManager?: ISystemManager) {
		this.name = name;
		this.registerEntityManager(entityManager);
		this.registerSystemManager(systemManager);
	}

	public add(element: IEntity | ISystem): this {
		if ((element as IEntity).isEntity) {
			return this.addEntity(element as IEntity);
		} else {
			return this.addSystem(element as ISystem);
		}
	}

	public addEntity(entity: IEntity): this {
		if (this.entityManager) {
			this.entityManager.addElement(entity);
		} else {
			throw new Error("The world doesn't have an entityManager yet.");
		}

		return this;
	}

	public addSystem(system: ISystem): this {
		if (this.systemManager) {
			this.systemManager.addElement(system);
		} else {
			throw new Error("The world doesn't have a systemManager yet.");
		}

		return this;
	}

	public clearAllEntities(): this {
		if (this.entityManager) {
			this.entityManager.clear();
		}

		return this;
	}

	public createEntity(name: string): IEntity | null {
		return this.entityManager?.createEntity(name) || null;
	}

	public hasEntity(entity: IEntity | string): boolean {
		if (this.entityManager) {
			return this.entityManager.has(entity);
		}

		return false;
	}

	public hasSystem(system: ISystem | string): boolean {
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

	public registerSystemManager(manager?: ISystemManager): this {
		this.unregisterSystemManager();
		this.systemManager = manager || new SystemManager(this);
		if (!this.systemManager.usedBy.includes(this)) {
			this.systemManager.usedBy.push(this);
		}

		return this;
	}

	public remove(element: IEntity | ISystem): this {
		if ((element as IEntity).isEntity) {
			return this.removeEntity(element as IEntity);
		} else {
			return this.removeSystem(element as ISystem);
		}
	}

	public removeEntity(entity: IEntity): this {
		if (this.entityManager) {
			this.entityManager.removeElement(entity);
		}

		return this;
	}

	public removeSystem(system: ISystem | string): this {
		if (this.systemManager) {
			this.systemManager.removeElement(system);
		}

		return this;
	}

	public run(): this {
		if (this.systemManager) {
			this.systemManager.run(this);
		}

		return this;
	}

	public unregisterEntityManager(): this {
		if (this.entityManager) {
			arr = this.entityManager.usedBy;
			arr.splice(arr.indexOf(this) - 1, 1);
			this.entityManager = null;
		}

		return this;
	}

	public unregisterSystemManager(): this {
		if (this.systemManager) {
			arr = this.systemManager.usedBy;
			arr.splice(arr.indexOf(this) - 1, 1);
			this.entityManager = null;
		}

		return this;
	}
}
