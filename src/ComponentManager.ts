import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IEntity from "./interfaces/IEntity";

// 私有全局变量，外部无法访问
let componentTmp: IComponent<any> | undefined;

export enum EComponentEvent {
	ADD_COMPONENT = "addComponent",
	REMOVE_COMPONENT = "removeComponent"
};

export type ComponentEventObject = {
	eventKey: EComponentEvent,
	life: number,
	manager: ComponentManager,
	component: IComponent<any>,
	target: IComponent<any>
};

export default class ComponentManager implements IComponentManager {
	public elements: Map<string, IComponent<any>> = new Map();
	public disabled = false;
	public usedBy: IEntity[] = [];
	public readonly isComponentManager = true;
	private static readonly ADD_COMPONENT = EComponentEvent.ADD_COMPONENT;
	private static readonly REMOVE_COMPONENT = EComponentEvent.REMOVE_COMPONENT;
	private static eventObject: ComponentEventObject = {} as ComponentEventObject;

	public add(component: IComponent<any>): this {
		if (this.has(component)) {
			this.removeByInstance(component);
		}

		return this.addComponentDirect(component);
	}

	public addComponentDirect(component: IComponent<any>): this {
		this.elements.set(component.name, component);
		component.usedBy.push(this);
		ComponentManager.eventObject = {
			component,
			manager: this,
			eventKey: ComponentManager.ADD_COMPONENT,
			life: Infinity,
			target: component
		}
		this.entityComponentChangeDispatch(ComponentManager.ADD_COMPONENT, ComponentManager.eventObject);

		return this;
	}

	public clear(): this {
		this.elements.clear();

		return this;
	};

	public get(name: string): IComponent<any> | null {
		componentTmp = this.elements.get(name);

		return componentTmp ? componentTmp : null;
	}

	public has(component: IComponent<any> | string): boolean {
		if (typeof component === "string") {
			return this.elements.has(component);
		} else {
			return this.elements.has(component.name);
		}
	}

	// TODO
	public isMixedFrom(componentManager: IComponentManager): boolean {
		console.log(componentManager);
		return false;
	}

	// TODO
	public mixFrom(componentManager: IComponentManager): this {
		console.log(componentManager);
		return this;
	}

	public remove(component: IComponent<any> | string): this {
		return typeof component === "string"
			? this.removeByName(component)
			: this.removeByInstance(component);
	}

	public removeByName(name: string): this {
		componentTmp = this.elements.get(name);
		if (componentTmp) {
			this.elements.delete(name);
			componentTmp.usedBy.splice(componentTmp.usedBy.indexOf(this), 1);

			ComponentManager.eventObject = {
				component: componentTmp,
				manager: this,
				eventKey: ComponentManager.REMOVE_COMPONENT,
				life: Infinity,
				target: componentTmp
			}
			this.entityComponentChangeDispatch(ComponentManager.REMOVE_COMPONENT, ComponentManager.eventObject);
		}

		return this;
	}

	public removeByInstance(component: IComponent<any>): this {
		if (this.elements.has(component.name)) {
			this.elements.delete(component.name);
			component.usedBy.splice(component.usedBy.indexOf(this), 1);
			ComponentManager.eventObject = {
				component,
				manager: this,
				eventKey: ComponentManager.REMOVE_COMPONENT,
				life: Infinity,
				target: component
			}
			this.entityComponentChangeDispatch(ComponentManager.REMOVE_COMPONENT, ComponentManager.eventObject);
		}

		return this;
	}

	private entityComponentChangeDispatch(type: EComponentEvent, eventObject: ComponentEventObject) {
		for(let entity of this.usedBy) {
			entity.dispatchEvent(type, eventObject);
			for(let manager of entity.usedBy) {
				manager.updatedEntities.add(entity);
			}
		}
	}
}
