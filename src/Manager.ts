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

	public elements: Map<number, T> = new Map();
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
		this.elements.set(element.id, element);
		element.usedBy.push(this);
		this.elementChangeDispatch(Manager.Events.ADD, this);

		return this;
	}

	public clear(): this {
		this.elements.clear();

		return this;
	}

	public get(name: string | number): T | null {
		if (typeof name === "number") {
			return this.elements.get(name) || null;
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const [_, item] of this.elements) {
			if (item.name === name) {
				return item;
			}
		}

		return null;
	}

	public has(element: T | string | number): boolean {
		if (typeof element === "number") {
			return this.elements.has(element);
		} else if (typeof element === "string") {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for (const [_, item] of this.elements) {
				if (item.name === element) {
					return true;
				}
			}

			return false;
		} else {
			return this.elements.has(element.id);
		}
	}

	public removeElement(element: T | string | number): this {
		if (typeof element === "number" || typeof element === "string") {
			elementTmp = this.get(element);
			if (elementTmp) {
				this.removeInstanceDirectly(elementTmp);
			}

			return this;
		}

		return this.removeElementByInstance(element);
	}

	public removeElementById(id: number): this {
		elementTmp = this.elements.get(id);
		if (elementTmp) {
			this.removeInstanceDirectly(elementTmp);
		}

		return this;
	}

	public removeElementByName(name: string): this {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const [_, item] of this.elements) {
			if (item.name === name) {
				return this.removeInstanceDirectly(item);
			}
		}

		return this;
	}

	public removeElementByInstance(element: T): this {
		if (this.elements.has(element.id)) {
			return this.removeInstanceDirectly(element);
		}

		return this;
	}

	// 必定有element情况
	private removeInstanceDirectly(element: T): this {
		this.elements.delete(element.id);
		element.usedBy.splice(element.usedBy.indexOf(this), 1);

		this.elementChangeDispatch(Manager.Events.REMOVE, this);

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
