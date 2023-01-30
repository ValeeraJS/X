import ComponentManager from "./ComponentManager";
import EventFirer from "@valeera/eventfirer";
import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import IWorld from "./interfaces/IWorld";
import { TreeNode } from "@valeera/tree";

let arr: any[];

export default class Entity extends TreeNode.mixin(EventFirer) implements IEntity {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isEntity = true;
	public componentManager: IComponentManager | null = null;
	public disabled = false;
	public name = "";
	public usedBy: IEntityManager[] = [];

	public constructor(name = "", componentManager?: IComponentManager) {
		super();
		this.name = name;
		this.registerComponentManager(componentManager);
	}

	public addComponent(component: IComponent<any>): this {
		if (this.componentManager) {
			this.componentManager.add(component);
		} else {
			throw new Error("Current entity hasn't registered a component manager yet.");
		}

		return this;
	}

	public addChild(entity: IEntity): this {
		super.addChild(entity);

		if (this.usedBy) {
			for (const manager of this.usedBy) {
				manager.add(entity);
			}
		}

		return this;
	}

	public addTo(manager: IEntityManager): this {
		manager.add(this);

		return this;
	}

	public addToWorld(world: IWorld): this {
		if (world.entityManager) {
			world.entityManager.add(this);
		}

		return this;
	}

	public destroy(): void {
		for (const manager of this.usedBy) {
			manager.remove(this);
		}
		this.unregisterComponentManager();
	}

	public getComponent(nameOrId: string | number): IComponent<any> | null {
		return this.componentManager?.get(nameOrId) || null;
	}

	public getComponentsByTagLabel(label: string): IComponent<any>[] {
		return this.componentManager?.getComponentsByTagLabel(label) || [];
	}

	public getFirstComponentByTagLabel(label: string): IComponent<any> | null {
		return this.componentManager?.getFirstComponentByTagLabel(label) || null;
	}

	public hasComponent(component: IComponent<any> | string | number): boolean {
		return this.componentManager?.has(component) || false;
	}

	public registerComponentManager(manager: IComponentManager = new ComponentManager()): this {
		this.unregisterComponentManager();
		this.componentManager = manager;
		if (!this.componentManager.usedBy.includes(this)) {
			this.componentManager.usedBy.push(this);
		}

		return this;
	}

	public removeChild(entity: IEntity): this {
		super.removeChild(entity);

		if (this.usedBy) {
			for (const manager of this.usedBy) {
				manager.remove(entity);
			}
		}

		return this;
	}

	public removeComponent(component: IComponent<any> | string): this {
		if (this.componentManager) {
			this.componentManager.remove(component);
		}

		return this;
	}

	public serialize(): any {
		return {};
	}

	public unregisterComponentManager(): this {
		if (this.componentManager) {
			arr = this.componentManager.usedBy;
			arr.splice(arr.indexOf(this) - 1, 1);
			this.componentManager = null;
		}

		return this;
	}
}
