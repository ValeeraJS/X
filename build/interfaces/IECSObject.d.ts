import { IManager } from "./IManager";
import { ISerializable } from "./ISerializable";
export interface IECSObject<T> extends ISerializable {
    disabled: boolean;
    name: string;
    usedBy: IManager<T>[];
}
