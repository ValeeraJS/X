import { IECSObject } from "../interfaces/IECSObject";
import { unsortedRemove } from "./unsortedRemove";

export const add = <U, T extends IECSObject<U>>(element: T, map: Map<number, T>, owner: U): boolean => {
	if (has(map, element)) {
		return false;
	}

	map.set(element.id, element);
	element.usedBy.push(owner);

	return true;
};

export const clear = <U, T extends IECSObject<U>>(map: Map<number, T>, owner: U) => {
	const arr = Array.from(map);

	for (let element of arr) {
		remove(map, element[1], owner);
	}

	return owner;
};

export const get = <U, T extends IECSObject<U>>(
	map: Map<number, T>,
	name: string | number | (new (...args: any[]) => T),
	strict = false,
): T | null => {
	if (typeof name === "number") {
		return map.get(name) ?? null;
	}
	if (typeof name === "function") {
		for (const [, item] of map) {
			if (strict) {
				if (item.constructor === name) {
					return item;
				}
			} else if (item instanceof name) {
				return item;
			}
		}
	}
	for (const [, item] of map) {
		if (item.name === name) {
			return item;
		}
	}

	return null;
};

export const has = <U, T extends IECSObject<U>>(
	map: Map<number, T>,
	element: T | number | string | (new (...args: any) => T),
	strict = false,
): boolean => {
	if (typeof element === "number") {
		return map.has(element);
	} else if (typeof element === "string") {
		for (const [, item] of map) {
			if (item.name === element) {
				return true;
			}
		}

		return false;
	} else if (typeof element === "function") {
		for (const [, item] of map) {
			if (strict) {
				if (item.constructor === element) {
					return true;
				}
			} else if (item instanceof element) {
				return true;
			}
		}

		return false;
	} else {
		return map.has((element as T).id);
	}
};

export const remove = <U, T extends IECSObject<U>>(
	map: Map<number, T>,
	element: T | string | number | (new (...args: any[]) => T),
	owner: U,
	strict = false,
): boolean => {
	let elementTmp: T | undefined;
	if (typeof element === "number" || typeof element === "string") {
		elementTmp = get(map, element);
	} else if (typeof element === "function") {
		for (let item of map) {
			if (strict) {
				if (item[1].constructor === element) {
					elementTmp = item[1];
					break;
				}
			} else if (item[1] instanceof element) {
				elementTmp = item[1];
				break;
			}
		}
	} else {
		for (let item of map) {
			if (item[1] === element) {
				elementTmp = item[1];
				break;
			}
		}
	}

	if (elementTmp) {
		map.delete(elementTmp.id);
		unsortedRemove(elementTmp.usedBy, elementTmp.usedBy.indexOf(owner));

		return true;
	}

	return false;
};
