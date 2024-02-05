import { IEventFirer } from "@valeera/eventfire";
import { IManager } from "./IManager";
import { ISerializable } from "./ISerializable";

export interface IECSObject<T> extends IEventFirer, ISerializable {
	readonly id: number;
	disabled: boolean;
	name: string;
	usedBy: IManager<T, IECSObject<any>>[];
}
