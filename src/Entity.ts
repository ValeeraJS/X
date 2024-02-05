import { ComponentManager } from "./ComponentManager";
import { IEventFirer, mixin } from "@valeera/eventfire";
import { IdGeneratorInstance } from "./Global";
import { TreeNode } from "@valeera/tree";
import { IEntitySerializedJson } from "./interfaces/ISerializable";
import { EntityManager } from "./EntityManager";
import { Component, ComponentConstructor } from "./Component";
import { World } from "./World";

export class Entity extends mixin(TreeNode) implements IEventFirer {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isEntity = true;
	public readonly componentManager: ComponentManager = new ComponentManager(this);
	public disabled = false;
	public name = "";
	public usedBy: EntityManager[] = [];

	public constructor(name = "Untitled Entity") {
		super();
		this.name = name;
	}

	public add(componentOrChild: Component<any> | Entity): this {
		if (componentOrChild instanceof Entity) {
			return this.addChild(componentOrChild);
		}

		return this.addComponent(componentOrChild);
	}

	public addComponent(component: Component<any>): this {
		this.componentManager.add(component);

		return this;
	}

	public addChild(entity: Entity): this {
		super.addChild(entity);

		for (const manager of this.usedBy) {
			manager.add(entity);
		}

		return this;
	}

	public addTo(worldOrManager: EntityManager | World | Entity): this {
		if (worldOrManager instanceof World) {
			return this.addToWorld(worldOrManager);
		}

		if (worldOrManager instanceof Entity) {
			worldOrManager.addChild(this);

			return this;
		}

		return this.addToManager(worldOrManager);
	}

	public addToWorld(world: World): this {
		world.entityManager.add(this);

		return this;
	}

	public addToManager(manager: EntityManager): this {
		manager.add(this);

		return this;
	}

	public clone(cloneComponents?: boolean, includeChildren?: boolean) {
		const entity = new Entity(this.name);
		if (cloneComponents) {
			this.componentManager.elements.forEach((component) => {
				entity.addComponent(component.clone());
			});
		} else {
			this.componentManager.elements.forEach((component) => {
				entity.addComponent(component);
			});
		}
		if (includeChildren) {
			for (let i = 0, len = this.children.length; i < len; i++) {
				entity.addChild(this.children[i].clone());
			}
		}
		return entity;
	}

	public destroy(): this {
		for (const manager of this.usedBy) {
			manager.remove(this);
		}
		this.componentManager.elements.forEach((c) => {
			c.destroy();
		});
		this.componentManager.clear();

		return this;
	}

	public getComponent<T>(nameOrId: string | number | ComponentConstructor<T>): Component<T> | null {
		return this.componentManager.get(nameOrId);
	}

	public getComponentsByTagLabel(label: string): Component<any>[] {
		return this.componentManager.getComponentsByTagLabel(label);
	}

	public getComponentByTagLabel(label: string): Component<any> | null {
		return this.componentManager.getComponentByTagLabel(label);
	}

	public getComponentsByClass<T>(clazz: ComponentConstructor<T>): Component<T>[] {
		return this.componentManager.getComponentsByClass(clazz);
	}

	public hasComponent(component: Component<any> | string | number | ComponentConstructor<any>): boolean {
		return this.componentManager.has(component);
	}

	public remove(entityOrComponent: Entity | Component<any> | ComponentConstructor<any>) {
		if (entityOrComponent instanceof Entity) {
			return this.removeChild(entityOrComponent);
		}

		return this.removeComponent(entityOrComponent);
	}

	public removeChild(entity: Entity): this {
		super.removeChild(entity);

		for (const manager of this.usedBy) {
			manager.remove(entity);
		}

		return this;
	}

	public removeComponent(component: Component<any> | string | ComponentConstructor<any>): this {
		this.componentManager.remove(component);

		return this;
	}

	public serialize(): IEntitySerializedJson {
		const result: IEntitySerializedJson = {
			id: this.id,
			name: this.name,
			disabled: this.disabled,
			class: "Entity",
			components: [],
		};

		this.componentManager.elements.forEach((c) => {
			result.components.push(c.id);
		});

		return result;
	}
}
