import ComponentManager from "./ComponentManager";
import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import IWorld from "./interfaces/IWorld";
import TreeNodeWithEvent from "./TreeNodeWithEvent";

let arr: any[];

export default class Entity extends TreeNodeWithEvent implements IEntity {
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

	public getComponent(name: string): IComponent<any> | null {
		return this.componentManager ? this.componentManager.get(name) : null;
	}

	public hasComponent(component: IComponent<any> | string): boolean {
		return this.componentManager ? this.componentManager.has(component) : false;
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
