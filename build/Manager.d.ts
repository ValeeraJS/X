import { EventFirer } from "@valeera/eventfire";
import { IECSObject } from "./interfaces/IECSObject";
export declare class Manager<T extends IECSObject<T>, U extends IECSObject<any>> extends EventFirer {
    elements: Map<number, T>;
    disabled: boolean;
    usedBy: U;
    readonly isManager = true;
    constructor(usedBy: U);
    add(element: T): this;
    clear(): this;
    get(name: string | number | (new (...args: any[]) => any)): T | null;
    has(element: T | string | number | (new (...args: any[]) => T)): boolean;
    remove(element: T | string | number | (new (...args: any[]) => T)): this;
    protected addElementDirectly(element: T): this;
    protected removeElementDirectly(element: T): this;
}
