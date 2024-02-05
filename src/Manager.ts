import { EventFirer } from "@valeera/eventfire";
import { IECSObject } from "./interfaces/IECSObject";

// 私有全局变量，外部无法访问
let elementTmp: any;

export class Manager<T extends IECSObject<T>, U extends IECSObject<any>> extends EventFirer {
	public elements: Map<number, T> = new Map();
	public disabled = false;
	public usedBy: U;
	public readonly isManager = true;

	constructor(usedBy: U) {
		super();
		this.usedBy = usedBy;
	}

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

	public get(name: string | number | (new (...args: any[]) => any)): T | null {
		if (typeof name === "number") {
			return this.elements.get(name) ?? null;
		}
		if (typeof name === "function" && name.prototype) {
			for (const [, item] of this.elements) {
				if (item instanceof name) {
					return item;
				}
			}
		}
		for (const [, item] of this.elements) {
			if (item.name === name) {
				return item;
			}
		}

		return null;
	}

	public has(element: T | string | number | (new (...args: any[]) => T)): boolean {
		if (typeof element === "number") {
			return this.elements.has(element);
		} else if (typeof element === "string") {
			for (const [, item] of this.elements) {
				if (item.name === element) {
					return true;
				}
			}

			return false;
		} else if (typeof element === "function" && element.prototype) {
			for (const [, item] of this.elements) {
				if (item.constructor === element) {
					return true;
				}
			}

			return false;
		} else {
			return this.elements.has((element as T).id);
		}
	}

	public remove(element: T | string | number | (new (...args: any[]) => T)): this {
		if (typeof element === "number" || typeof element === "string") {
			elementTmp = this.get(element);
			if (elementTmp) {
				this.removeElementDirectly(elementTmp);
			}
		} else if (typeof element === "function") {
			this.elements.forEach((item: T) => {
				if (item.constructor === element) {
					this.removeElementDirectly(item);
				}
			});
		} else {
			this.elements.forEach((item: T) => {
				if (item === element) {
					this.removeElementDirectly(element);
				}
			});
		}

		return this;
	}

	protected addElementDirectly(element: T): this {
		this.elements.set(element.id, element);
		element.usedBy.push(this);

		return this;
	}

	// 必定有element情况
	protected removeElementDirectly(element: T): this {
		this.elements.delete(element.id);
		element.usedBy.splice(element.usedBy.indexOf(this), 1);

		return this;
	}
}
