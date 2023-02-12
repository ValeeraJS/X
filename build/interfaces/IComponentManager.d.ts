import { IComponent } from "./IComponent";
import { IEntity } from "./IEntity";
import { IManager } from "./IManager";
export type ComponentConstructor = new () => IComponent<any>;
export interface IComponentManager extends IManager<IComponent<any>> {
    readonly isComponentManager: boolean;
    usedBy: IEntity[];
    getComponentsByTagLabel(label: string): IComponent<any>[];
    getComponentByTagLabel(label: string): IComponent<any> | null;
    getComponentsByClass(clazz: ComponentConstructor): IComponent<any>[];
    getComponentByClass(clazz: ComponentConstructor): IComponent<any> | null;
}
