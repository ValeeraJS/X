import { IComponent } from "./interfaces/IComponent";
import { ComponentConstructor, IComponentManager } from "./interfaces/IComponentManager";
import { Manager } from "./Manager";

export enum EComponentEvent {
	ADD_COMPONENT = "addComponent",
	REMOVE_COMPONENT = "removeComponent",
}

export interface ComponentEventObject {
	eventKey: EComponentEvent;
	manager: IComponentManager;
	component: IComponent<any>;
	target: IComponent<any>;
}

export class ComponentManager extends Manager<IComponent<any>> implements IComponentManager {
	public isComponentManager = true;

	public add(element: IComponent<any>): this {
		if (this.has(element)) {
			return this;
		}

		const componentSet = this.checkedComponentsWithTargetTags(element);

		for (const item of componentSet) {
			this.removeInstanceDirectly(item);
		}

		return this.addElementDirectly(element);
	}

	public getComponentsByClass(clazz: ComponentConstructor): IComponent<any>[] {
		const result: IComponent<any>[] = [];

		this.elements.forEach((component) => {
			if (component instanceof clazz) {
				result.push(component);
			}
		});

		return result;
	}

	public getComponentByClass(clazz: ComponentConstructor): IComponent<any> | null {
		for (const [, component] of this.elements) {
			if (component instanceof clazz) {
				return component;
			}
		}

		return null;
	}

	public getComponentsByTagLabel(label: string): IComponent<any>[] {
		const result: IComponent<any>[] = [];

		this.elements.forEach((component) => {
			if (component.hasTagLabel(label)) {
				result.push(component);
			}
		});

		return result;
	}

	public getComponentByTagLabel(label: string): IComponent<any> | null {
		for (const [, component] of this.elements) {
			if (component.hasTagLabel(label)) {
				return component;
			}
		}

		return null;
	}

	// 找到所有含目标组件唯一标签一致的组件。只要有任意1个标签符合就行。此处规定名称一致的tag，unique也必须是一致的。且不可修改
	private checkedComponentsWithTargetTags(component: IComponent<any>): Set<IComponent<any>> {
		const result: Set<IComponent<any>> = new Set();
		let arr: IComponent<any>[];

		for (let i = component.tags.length - 1; i > -1; i--) {
			if (component.tags[i].unique) {
				arr = this.getComponentsByTagLabel(component.tags[i].label);

				if (arr.length) {
					for (let j = arr.length - 1; j > -1; j--) {
						result.add(arr[j]);
					}
				}
			}
		}

		return result;
	}
}
