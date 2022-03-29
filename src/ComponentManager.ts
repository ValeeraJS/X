import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IEntity from "./interfaces/IEntity";
// import { IdGeneratorInstance } from "./Global";
// import IEntity from "./interfaces/IEntity";
import Manager from "./Manager";

// 私有全局变量，外部无法访问
// let componentTmp: IComponent<any> | undefined;

export enum EComponentEvent {
	ADD_COMPONENT = "addComponent",
	REMOVE_COMPONENT = "removeComponent"
}

export interface ComponentEventObject {
	eventKey: EComponentEvent;
	manager: IComponentManager;
	component: IComponent<any>;
	target: IComponent<any>;
}

export default class ComponentManager
	extends Manager<IComponent<any>>
	implements IComponentManager
{
	public isComponentManager = true;
	public usedBy: IEntity[] = [];
}
