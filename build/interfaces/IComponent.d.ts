import IComponentManager from "./IComponentManager";
import IECSObject from "./IECSObject";
export interface ComponentTag {
    readonly label: string;
    readonly unique: boolean;
}
export default interface IComponent<T> extends IECSObject<IComponent<any>> {
    readonly isComponent: boolean;
    data: T;
    usedBy: IComponentManager[];
    dirty: boolean;
    tags: ComponentTag[];
    clone(): IComponent<T>;
    hasTagLabel(label: string): boolean;
}
