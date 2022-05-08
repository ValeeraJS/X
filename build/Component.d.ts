import IComponent, { ComponentTag } from "./interfaces/IComponent";
import { ISerializedJson } from "./interfaces/ISerializable";
export interface IComponentSerializedJson<T> extends ISerializedJson {
    data: T;
    name: string;
    disabled: boolean;
}
export default class Component<T> implements IComponent<T> {
    static unserialize<T>(json: IComponentSerializedJson<T>): Component<T>;
    readonly isComponent = true;
    readonly id: number;
    data: T;
    disabled: boolean;
    name: string;
    usedBy: never[];
    dirty: boolean;
    tags: ComponentTag[];
    constructor(name: string, data: T, tags?: ComponentTag[]);
    clone(): IComponent<T>;
    hasTagLabel(label: string): boolean;
    serialize(): any;
}
