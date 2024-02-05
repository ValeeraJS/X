import { ComponentTag } from "./interfaces/IComponent";
import { IComponentSerializedJson } from "./interfaces/ISerializable";
import { ComponentManager } from "./ComponentManager";
import { EventFirer } from "@valeera/eventfire";
export type ComponentConstructor<T> = new (...args: any[]) => Component<T>;
export declare class Component<T> extends EventFirer {
    #private;
    static unserialize<T>(json: IComponentSerializedJson<T>): Component<T>;
    readonly isComponent = true;
    readonly id: number;
    data: T | null;
    disabled: boolean;
    name: string;
    usedBy: ComponentManager[];
    tags: ComponentTag[];
    get dirty(): boolean;
    set dirty(v: boolean);
    constructor(data?: T | null, tags?: ComponentTag[], name?: string);
    clone(): Component<T>;
    destroy(): void;
    hasTagLabel(label: string): boolean;
    serialize(): IComponentSerializedJson<T | null>;
}
