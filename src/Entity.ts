import IComponent from "./interfaces/IComponent";
import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IWorld from "./interfaces/IWorld";

// 私有全局变量，外部无法访问
let componentTmp: IComponent | undefined;

export default class Entity implements IEntity {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isEntity = true;
	public components: Map<string, IComponent> = new Map();
	public world: IWorld | null = null;

	public addComponent(component: IComponent): this {
		if (this.hasComponent(component)) {
			this.removeComponentByInstance(component);
		}

		return this.addComponentDirect(component);
	}

	public addComponentDirect(component: IComponent): this {
		this.components.set(component.name, component);
		component.usedBy.push(this);

		return this;
	}

	public addTo(world: IWorld): this {
		world.entities.push(this);
		this.world = world;

		return this;
	}

	public getComponent(name: string): IComponent | null {
		const c = this.components.get(name);

		if (!c) {
			return null;
		} else {
			return c;
		}
	}

	public hasComponent(component: IComponent | string): boolean {
		if (typeof component === "string") {
			return this.components.has(component);
		} else {
			return this.components.has(component.name);
		}
	}

	// TODO
	public isMixedFrom(entity: IEntity): boolean {
		return false;
	}

	// TODO
	public mixComponentsFrom(entity: IEntity): this {
		return this;
	}

	public removeComponent(component: IComponent | string): this {
		return typeof component === "string"
			? this.removeComponentByName(component)
			: this.removeComponentByInstance(component);
	}

	public removeComponentByName(name: string): this {
		componentTmp = this.components.get(name);
		if (componentTmp) {
			this.components.delete(name);
			componentTmp.usedBy.splice(componentTmp.usedBy.indexOf(this), 1);
		}

		return this;
	}

	public removeComponentByInstance(component: IComponent): this {
		if (this.components.has(component.name)) {
			this.components.delete(component.name);
			component.usedBy.splice(component.usedBy.indexOf(this), 1);
		}

		return this;
	}
}
