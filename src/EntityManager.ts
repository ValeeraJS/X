import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import IWorld from "./interfaces/IWorld";

// 私有全局变量，外部无法访问
let entityTmp: IEntity | undefined;

export default class EntityManager implements IEntityManager {
	public elements: Map<string, IEntity> = new Map();
	public data: any = null;
	public disabled = false;
	public updatedEntities: Set<IEntity> = new Set();
	public readonly isEntityManager = true;
	public usedBy: IWorld[] = [];

	public constructor(world?: IWorld) {
		if (world) {
			this.usedBy.push(world);
		}
	}

	public add(entity: IEntity): this {
		if (this.has(entity)) {
			this.removeByInstance(entity);
		}

		return this.addComponentDirect(entity);
	}

	public addComponentDirect(entity: IEntity): this {
		this.elements.set(entity.name, entity);
		entity.usedBy.push(this);
		this.updatedEntities.add(entity);

		return this;
	}

	public clear(): this {
		this.elements.clear();

		return this;
	}

	public get(name: string): IEntity | null {
		entityTmp = this.elements.get(name);

		return entityTmp ? entityTmp : null;
	}

	public has(entity: IEntity | string): boolean {
		if (typeof entity === "string") {
			return this.elements.has(entity);
		} else {
			return this.elements.has(entity.name);
		}
	}

	public remove(entity: IEntity | string): this {
		return typeof entity === "string"
			? this.removeByName(entity)
			: this.removeByInstance(entity);
	}

	public removeByName(name: string): this {
		entityTmp = this.elements.get(name);
		if (entityTmp) {
			this.elements.delete(name);
			this.deleteEntityFromSystemSet(entityTmp);
		}

		return this;
	}

	public removeByInstance(entity: IEntity): this {
		if (this.elements.has(entity.name)) {
			this.elements.delete(entity.name);
			this.deleteEntityFromSystemSet(entity);
		}

		return this;
	}

	private deleteEntityFromSystemSet(entity: IEntity) {
		entity.usedBy.splice(entity.usedBy.indexOf(this), 1);

		for (const world of this.usedBy) {
			if (world.systemManager) {
				world.systemManager.elements.forEach((system: ISystem) => {
					if (system.entitySet.get(this)) {
						(system.entitySet.get(this) as any).delete(entity);
					}
				});
			}
		}
	}
}
