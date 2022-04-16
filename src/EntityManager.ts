import Entity from "./Entity";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import IWorld from "./interfaces/IWorld";
import Manager from "./Manager";

// 私有全局变量，外部无法访问
let entityTmp: IEntity | undefined;

export default class EntityManager extends Manager<IEntity> implements IEntityManager {
	// public elements: Map<string, IEntity> = new Map();
	public data: any = null;
	public updatedEntities: Set<IEntity> = new Set();
	public readonly isEntityManager = true;

	public constructor(world?: IWorld) {
		super();
		if (world) {
			this.usedBy.push(world);
		}
	}

	public addElementDirect(entity: IEntity): this {
		super.addElementDirect(entity);
		this.updatedEntities.add(entity);

		for (const child of entity.children) {
			if (child) {
				this.addElement(child as IEntity);
			}
		}

		return this;
	}

	public createEntity(name: string): IEntity {
		const entity = new Entity(name);

		this.addElement(entity);

		return entity;
	}

	public removeElementByName(name: string): this {
		entityTmp = this.elements.get(name);
		if (entityTmp) {
			super.removeElementByName(name);
			this.deleteEntityFromSystemSet(entityTmp);

			for (const child of entityTmp?.children) {
				if (child) {
					this.removeElementByInstance(child as IEntity);
				}
			}
		}

		return this;
	}

	public removeElementByInstance(entity: IEntity): this {
		if (this.elements.has(entity.name)) {
			super.removeElementByInstance(entity);
			this.deleteEntityFromSystemSet(entity);

			for (const child of entity.children) {
				if (child) {
					this.removeElementByInstance(child as IEntity);
				}
			}
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
