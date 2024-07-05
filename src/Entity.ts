import { IdGeneratorInstance } from "./Global";
import { TreeNode } from "@valeera/tree";
import { Component, ComponentConstructor } from "./Component";
import { EntitiesCache, World } from "./World";
import { IECSObject } from "./interfaces/IECSObject";
import { add, clear, get, has, remove } from "./utils/ecsManagerOperations";

export type EntityConstructor = new (...args: any[]) => Entity;

export class Entity extends TreeNode implements IECSObject<World>{
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isEntity = true;
	public readonly components = new Map<number, Component<any>>();
	public disabled = false;
	public name: string;
	public usedBy: World[] = [];
	public children: Entity[] = [];

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
		add(component, this.components, this as Entity);
		
		for (let i = 0, len = this.usedBy.length; i < len; i++) {
			EntitiesCache.get(this.usedBy[i]).add(this);
		}

		return this;
	}

	public addChild(entity: Entity): this {
		super.addChild(entity);

		for (const world of this.usedBy) {
			world.add(entity);
		}

		return this;
	}

	public clone(cloneComponents?: boolean, includeChildren?: boolean) {
		const entity = new Entity(this.name);
		if (cloneComponents) {
			this.components.forEach((component) => {
				entity.addComponent(component.clone());
			});
		} else {
			this.components.forEach((component) => {
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

		this.components.forEach((c) => {
			c.destroy();
		});
		
		return clear(this.components, this as Entity) as this;
	}

	public getComponent<T>(nameOrId: string | number | ComponentConstructor<T>): Component<T> | null {
		return get(this.components, nameOrId);
	}

	public hasComponent(component: Component<any> | string | number | ComponentConstructor<any>): boolean {
		return has(this.components, component);
	}

	public remove(entityOrComponent: Entity | Component<any> | ComponentConstructor<any>) {
		if (entityOrComponent instanceof Entity) {
			return this.removeChild(entityOrComponent);
		}

		return this.removeComponent(entityOrComponent);
	}

	public removeChild(entity: Entity): this {
		super.removeChild(entity);

		for (const world of this.usedBy) {
			world.removeEntity(entity);
		}

		return this;
	}

	public removeComponent(component: Component<any> | string | ComponentConstructor<any>): this {
		for (let i = 0, len = this.usedBy.length; i < len; i++) {
			EntitiesCache.get(this.usedBy[i]).add(this);
		}

		remove(this.components, component, this as Entity);

		return this;
	}
}
