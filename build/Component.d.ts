import { Entity } from "./Entity";
import { IECSObject } from "./interfaces/IECSObject";
export type ComponentConstructor<DataType> = new (...args: any[]) => Component<DataType>;
export declare class Component<DataType> implements IECSObject<Entity> {
    readonly isComponent = true;
    readonly id: number;
    data: DataType | null;
    disabled: boolean;
    name: string;
    usedBy: Entity[];
    constructor(data?: DataType | null, name?: string);
    clone(): Component<DataType>;
    destroy(): void;
}
