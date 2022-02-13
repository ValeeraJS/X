import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IECSObject from "./interfaces/IECSObject";
import IEntity from "./interfaces/IEntity";
import IManager from "./interfaces/IManager";

// 私有全局变量，外部无法访问
let elementTmp: any;

export enum EComponentEvent {
	ADD = "add",
	REMOVE = "remove"
}

export interface EventObject {
	eventKey: EComponentEvent;
	manager: IComponentManager;
	component: IComponent<any>;
	element: IComponent<any>;
}

export default class Manager<T extends IECSObject> implements IManager<T> {
	public static readonly Events = EComponentEvent;
	// private static eventObject: EventObject = {
	// 	component: null as any,
	// 	element: null as any,
	// 	eventKey: null as any,
	// 	manager: null as any
	// };

	public elements: Map<string, T> = new Map();
	public disabled = false;
	public usedBy: IEntity[] = [];
	public readonly isManager = true;

	public add(component: T): this {
		if (this.has(component)) {
			this.removeByInstance(component);
		}

		return this.addComponentDirect(component);
	}

	public addComponentDirect(component: T): this {
		this.elements.set(component.name, component);
		component.usedBy.push(this);
		// Manager.eventObject = {
		// 	component,
		// 	element: component,
		// 	eventKey: Manager.Events.ADD,
		// 	manager: this
		// };
		this.entityComponentChangeDispatch(Manager.Events.ADD, this);

		return this;
	}

	public clear(): this {
		this.elements.clear();

		return this;
	}

	public get(name: string): T | null {
		elementTmp = this.elements.get(name);

		return elementTmp ? elementTmp : null;
	}

	public has(component: T | string): boolean {
		if (typeof component === "string") {
			return this.elements.has(component);
		} else {
			return this.elements.has(component.name);
		}
	}

	public remove(component: T | string): this {
		return typeof component === "string"
			? this.removeByName(component)
			: this.removeByInstance(component);
	}

	public removeByName(name: string): this {
		elementTmp = this.elements.get(name);
		if (elementTmp) {
			this.elements.delete(name);
			elementTmp.usedBy.splice(elementTmp.usedBy.indexOf(this), 1);

			// Manager.eventObject = {
			// 	component: elementTmp,
			// 	element: elementTmp,
			// 	eventKey: Manager.Events.REMOVE,
			// 	manager: this
			// };
			this.entityComponentChangeDispatch(Manager.Events.REMOVE, this);
		}

		return this;
	}

	public removeByInstance(component: T): this {
		if (this.elements.has(component.name)) {
			this.elements.delete(component.name);
			component.usedBy.splice(component.usedBy.indexOf(this), 1);
			// Manager.eventObject = {
			// 	component,
			// 	eventKey: Manager.Events.REMOVE,
			// 	manager: this,
			// 	element: component
			// };
			this.entityComponentChangeDispatch(Manager.Events.REMOVE, this);
		}

		return this;
	}

	private entityComponentChangeDispatch(type: EComponentEvent, eventObject: any) {
		for (const entity of this.usedBy) {
			(entity as any).fire?.(type, eventObject);
			for (const manager of entity.usedBy) {
				manager.updatedEntities.add(entity);
			}
		}
	}
}
