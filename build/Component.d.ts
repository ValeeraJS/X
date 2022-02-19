import IComponent from "./interfaces/IComponent";
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
    data: T | null;
    disabled: boolean;
    name: string;
    usedBy: never[];
    dirty: boolean;
    constructor(name: string, data?: T | null);
    clone(): IComponent<T>;
    serialize(): any;
}
