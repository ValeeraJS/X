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
	public name = "";
	public usedBy: IEntityManager[] = [];

	public constructor(name = "", componentManager?: IComponentManager) {
		super();
		this.name = name;
		this.registerComponentManager(componentManager);
	}

	public addComponent(component: IComponent<any>): this {
		if (this.componentManager) {
			this.componentManager.addElement(component);
		} else {
			throw new Error("Current entity hasn't registered a component manager yet.");
		}

		return this;
	}

	public addChild(entity: IEntity): this {
		super.addChild(entity);

		if (this.usedBy) {
			for (const manager of this.usedBy) {
				manager.addElement(entity);
			}
		}

		return this;
	}

	public addTo(manager: IEntityManager): this {
		manager.addElement(this);

		return this;
	}

	public addToWorld(world: IWorld): this {
		if (world.entityManager) {
			world.entityManager.addElement(this);
		}

		return this;
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
				manager.removeElement(entity);
			}
		}

		return this;
	}

	public removeComponent(component: IComponent<any> | string): this {
		if (this.componentManager) {
			this.componentManager.removeElement(component);
		}

		return this;
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
