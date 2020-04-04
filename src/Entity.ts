import ComponentManager from "./ComponentManager";
import IComponent from "./interfaces/IComponent";
import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IWorld from "./interfaces/IWorld";
import IEntityManager from "./interfaces/IEntityManager";
import EventDispatcher from "@valeera/eventdispatcher";
import IComponentManager from "./interfaces/IComponentManager";

let arr: any[];

export default class Entity extends EventDispatcher implements IEntity {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isEntity = true;
	public componentManager: IComponentManager | null;
	public name: string = "";
	public usedBy: IEntityManager[] = [];

	public constructor(name: string, componentManager?: IComponentManager) {
		super();
		this.name = name;
		this.registerComponentManager(componentManager);
	}

	public addComponent(component: IComponent): this {
		if (this.componentManager) {
			this.componentManager.add(component);
		} else {
			throw new Error("Current entity hasn't registered a component manager yet.");
		}

		return this;
	}

	public addTo(manager: IEntityManager): this {
		manager.add(this);

		return this;
	}

	public addToWorld(world: IWorld<any>): this {
		if (world.entityManager) {
			world.entityManager.add(this);
		}

		return this;
	}

	public getComponent(name: string): IComponent | null {
		return this.componentManager ? this.componentManager.get(name) : null;
	}

	public hasComponent(component: IComponent | string): boolean {
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

	public removeComponent(component: IComponent | string): this {
		if (this.componentManager) {
			this.componentManager.remove(component);
		}

		return this;
	}

	public unregisterComponentManager() {
		if (this.componentManager) {
			arr = this.componentManager.usedBy;
			arr.splice(arr.indexOf(this) - 1, 1);
			this.componentManager = null;
		}

		return this;
	}
}
