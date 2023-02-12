import { Entity } from "./Entity";
import { IEntity } from "./interfaces/IEntity";
import { IEntityManager } from "./interfaces/IEntityManager";
import { ISystem } from "./interfaces/ISystem";
import { IWorld } from "./interfaces/IWorld";
import { Manager } from "./Manager";

export class EntityManager extends Manager<IEntity> implements IEntityManager {
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

	public createEntity(name: string): IEntity {
		const entity = new Entity(name);

		this.add(entity);

		return entity;
	}

	protected addElementDirectly(entity: IEntity): this {
		super.addElementDirectly(entity);
		this.updatedEntities.add(entity);

		for (const child of entity.children) {
			if (child) {
				this.add(child as IEntity);
			}
		}

		return this;
	}

	protected removeInstanceDirectly(entity: IEntity): this {
		super.removeInstanceDirectly(entity);
		this.deleteEntityFromSystemSet(entity);

		for (const child of entity.children) {
			if (child) {
				this.remove(child as IEntity);
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
