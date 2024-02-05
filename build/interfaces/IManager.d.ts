import { IECSObject } from "./IECSObject";
export interface IManager<T, U extends IECSObject<any>> {
    elements: Map<number, T>;
    usedBy: U;
    add: (element: T, ...args: any[]) => this;
    clear: () => this;
    get: (name: string | number | (new (...args: any[]) => T)) => T | null;
    has: (element: T | string | number) => boolean;
    remove: (element: T | string | number) => this;
}
