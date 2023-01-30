import EventFirer from "@valeera/eventfirer";
import IECSObject from "./interfaces/IECSObject";
// import IEntity from "./interfaces/IEntity";
import IManager from "./interfaces/IManager";

// 私有全局变量，外部无法访问
let elementTmp: any;

export const ElementChangeEvent = {
	ADD: "add",
	REMOVE: "remove"
};

export default class Manager<T extends IECSObject<T>> extends EventFirer implements IManager<T> {
	public static readonly Events = ElementChangeEvent;

	public elements: Map<number, T> = new Map();
	public disabled = false;
	public usedBy: any[] = [];
	public readonly isManager = true;

	public add(element: T): this {
		if (this.has(element)) {
			return this;
		}

		return this.addElementDirectly(element);
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

	public remove(element: T | string | number): this {
		if (typeof element === "number" || typeof element === "string") {
			elementTmp = this.get(element);
			if (elementTmp) {
				this.removeInstanceDirectly(elementTmp);
			}

			return this;
		}

		if (this.elements.has(element.id)) {
			return this.removeInstanceDirectly(element);
		}

		return this;
	}

	protected addElementDirectly(element: T): this {
		this.elements.set(element.id, element);
		element.usedBy.push(this);
		this.elementChangedFireEvent(Manager.Events.ADD, this);

		return this;
	}

	// 必定有element情况
	protected removeInstanceDirectly(element: T): this {
		this.elements.delete(element.id);
		element.usedBy.splice(element.usedBy.indexOf(this), 1);

		this.elementChangedFireEvent(Manager.Events.REMOVE, this);

		return this;
	}

	private elementChangedFireEvent(type: string, eventObject: any) {
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
