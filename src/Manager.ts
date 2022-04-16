import EventFirer from "@valeera/eventdispatcher";
import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IECSObject from "./interfaces/IECSObject";
// import IEntity from "./interfaces/IEntity";
import IManager from "./interfaces/IManager";

// 私有全局变量，外部无法访问
let elementTmp: any;

export enum EElementChangeEvent {
	ADD = "add",
	REMOVE = "remove"
}

export interface EventObject {
	eventKey: EElementChangeEvent;
	manager: IComponentManager;
	component: IComponent<any>;
	element: IComponent<any>;
}

export default class Manager<T extends IECSObject> extends EventFirer implements IManager<T> {
	public static readonly Events = EElementChangeEvent;
	// private static eventObject: EventObject = {
	// 	component: null as any,
	// 	element: null as any,
	// 	eventKey: null as any,
	// 	manager: null as any
	// };

	public elements: Map<string, T> = new Map();
	public disabled = false;
	public usedBy: any[] = [];
	public readonly isManager = true;

	public addElement(element: T): this {
		if (this.has(element)) {
			this.removeElementByInstance(element);
		}

		return this.addElementDirect(element);
	}

	public addElementDirect(element: T): this {
		this.elements.set(element.name, element);
		element.usedBy.push(this);
		this.elementChangeDispatch(Manager.Events.ADD, this);

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

	public has(element: T | string): boolean {
		if (typeof element === "string") {
			return this.elements.has(element);
		} else {
			return this.elements.has(element.name);
		}
	}

	public removeElement(element: T | string): this {
		return typeof element === "string"
			? this.removeElementByName(element)
			: this.removeElementByInstance(element);
	}

	public removeElementByName(name: string): this {
		elementTmp = this.elements.get(name);
		if (elementTmp) {
			this.elements.delete(name);
			elementTmp.usedBy.splice(elementTmp.usedBy.indexOf(this), 1);

			this.elementChangeDispatch(Manager.Events.REMOVE, this);
		}

		return this;
	}

	public removeElementByInstance(element: T): this {
		if (this.elements.has(element.name)) {
			this.elements.delete(element.name);
			element.usedBy.splice(element.usedBy.indexOf(this), 1);

			this.elementChangeDispatch(Manager.Events.REMOVE, this);
		}

		return this;
	}

	private elementChangeDispatch(type: EElementChangeEvent, eventObject: any) {
		for (const entity of this.usedBy) {
			(entity as any).fire?.(type, eventObject);
			if (entity.usedBy) {
				for (const manager of entity.usedBy) {
					manager.updatedEntities.add(entity);
				}
			}
		}
	}
}
