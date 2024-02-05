import { Component } from "./Component";
import type { Entity } from "./Entity";
import { CommonECSObjectEvents, EntityEvents } from "./Events";
import { Manager } from "./Manager";

export enum EComponentEvent {
	ADD_COMPONENT = "addComponent",
	REMOVE_COMPONENT = "removeComponent",
}

export interface ComponentEventObject {
	eventKey: EComponentEvent;
	manager: ComponentManager;
	component: Component<any>;
	target: Component<any>;
}

export class ComponentManager extends Manager<Component<any>, Entity> {
	public isComponentManager = true;

	public add(element: Component<any>): this {
		if (this.has(element)) {
			return this;
		}

		const componentSet = this.checkedComponentsWithTargetTags(element);

		for (const item of componentSet) {
			this.removeElementDirectly(item);
		}

		return this.addElementDirectly(element);
	}

	public getComponentsByClass<T extends Component<any>>(clazz: new (...args: any[]) => T): T[] {
		const result: T[] = [];

		this.elements.forEach((component) => {
			if (component instanceof clazz) {
				result.push(component);
			}
		});

		return result;
	}

	public getComponentsByTagLabel(label: string): Component<any>[] {
		const result: Component<any>[] = [];

		this.elements.forEach((component) => {
			if (component.hasTagLabel(label)) {
				result.push(component);
			}
		});

		return result;
	}

	public getComponentByTagLabel(label: string): Component<any> | null {
		for (const [, component] of this.elements) {
			if (component.hasTagLabel(label)) {
				return component;
			}
		}

		return null;
	}

	protected addElementDirectly(element: Component<any>): this {
		super.addElementDirectly(element);

		element.fire(CommonECSObjectEvents.ADDED, element);
		this.usedBy.fire(EntityEvents.ADD_COMPONENT, this);
		for (let i = 0, len = this.usedBy.usedBy.length; i < len; i++) {
			this.usedBy.usedBy[i].updatedEntities.add(this.usedBy);
		}

		return this;
	}

	// 必定有element情况
	protected removeElementDirectly(element: Component<any>): this {
		super.removeElementDirectly(element);

		element.fire(CommonECSObjectEvents.REMOVED, element);
		this.usedBy.fire(EntityEvents.REMOVE_COMPONENT, this);
		for (let i = 0, len = this.usedBy.usedBy.length; i < len; i++) {
			this.usedBy.usedBy[i].updatedEntities.add(this.usedBy);
		}

		return this;
	}

	// 找到所有含目标组件唯一标签一致的组件。只要有任意1个标签符合就行。此处规定名称一致的tag，unique也必须是一致的。且不可修改
	private checkedComponentsWithTargetTags(component: Component<any>): Set<Component<any>> {
		const result: Set<Component<any>> = new Set();
		let arr: Component<any>[];

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
