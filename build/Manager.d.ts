import EventFirer from "@valeera/eventfirer";
import IECSObject from "./interfaces/IECSObject";
import IManager from "./interfaces/IManager";
export declare const ElementChangeEvent: {
    ADD: string;
    REMOVE: string;
};
export default class Manager<T extends IECSObject<T>> extends EventFirer implements IManager<T> {
    static readonly Events: {
        ADD: string;
        REMOVE: string;
    };
    elements: Map<number, T>;
    disabled: boolean;
    usedBy: any[];
    readonly isManager = true;
    add(element: T): this;
    clear(): this;
    get(name: string | number): T | null;
    has(element: T | string | number): boolean;
    remove(element: T | string | number): this;
    protected addElementDirectly(element: T): this;
    protected removeInstanceDirectly(element: T): this;
    private elementChangedFireEvent;
}
