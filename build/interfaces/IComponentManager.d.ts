import { IComponent } from "./IComponent";
import { IEntity } from "./IEntity";
import { IManager } from "./IManager";
export interface IComponentManager extends IManager<IComponent<any>, IEntity> {
    readonly isComponentManager: boolean;
    usedBy: IEntity;
    getComponentsByTagLabel(label: string): IComponent<any>[];
    getComponentByTagLabel(label: string): IComponent<any> | null;
    getComponentsByClass(clazz: any): IComponent<any>[];
    getComponentByClass(clazz: any): IComponent<any> | null;
}
