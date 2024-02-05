import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { System } from "./System";
import { World } from "./World";

export class EntityManager extends Manager<Entity, World> {
	public data: any = null;
	public updatedEntities: Set<Entity> = new Set();
	public readonly isEntityManager = true;

	public createEntity(name: string): Entity {
		const entity = new Entity(name);
		this.add(entity);

		return entity;
	}

	protected addElementDirectly(entity: Entity): this {
		super.addElementDirectly(entity);
		this.updatedEntities.add(entity);

		for (const child of entity.children) {
			this.add(child as Entity);
		}

		return this;
	}

	protected removeElementDirectly(entity: Entity): this {
		super.removeElementDirectly(entity);
		this.deleteEntityFromSystemSet(entity);

		for (const child of entity.children) {
			this.remove(child as Entity);
		}

		return this;
	}

	private deleteEntityFromSystemSet(entity: Entity) {
		entity.usedBy.splice(entity.usedBy.indexOf(this), 1);

		const world = this.usedBy;
		world.systemManager.elements.forEach((system: System) => {
			system.entitySet.get(this)?.delete(entity);
		});
	}
}
