import { ComponentTag, IComponent } from "./interfaces/IComponent";
import { ISerializedJson } from "./interfaces/ISerializable";
import { IComponentManager } from "./interfaces/IComponentManager";
export interface IComponentSerializedJson<T> extends ISerializedJson {
    data: T;
    name: string;
    disabled: boolean;
}
export declare class Component<T> implements IComponent<T> {
    #private;
    static unserialize<T>(json: IComponentSerializedJson<T>): Component<T>;
    readonly isComponent = true;
    readonly id: number;
    data: T;
    disabled: boolean;
    name: string;
    usedBy: IComponentManager[];
    tags: ComponentTag[];
    get dirty(): boolean;
    set dirty(v: boolean);
    constructor(name: string, data: T, tags?: ComponentTag[]);
    clone(): IComponent<T>;
    hasTagLabel(label: string): boolean;
    serialize(): any;
}
