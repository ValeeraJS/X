import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import Manager from "./Manager";

let systemTmp: ISystem | undefined | null;

export const SystemEvent = {
	ADD: "add",
	AFTER_RUN: "afterRun",
	BEFORE_RUN: "beforeRun",
	REMOVE: "remove"
};

export default class SystemManager extends Manager<ISystem> implements ISystemManager {
	public static readonly Events = SystemEvent;

	public disabled = false;
	public elements: Map<number, ISystem> = new Map();
	public loopTimes = 0;
	public usedBy: IWorld[] = [];

	public constructor(world?: IWorld) {
		super();
		if (world) {
			this.usedBy.push(world);
		}
	}

	public add(system: ISystem): this {
		super.add(system);
		this.updateSystemEntitySetByAddFromManager(system);

		return this;
	}

	public clear(): this {
		this.elements.clear();

		return this;
	}

	public remove(element: ISystem | string | number): this {
		if (typeof element === "number" || typeof element === "string") {
			systemTmp = this.get(element);
			if (systemTmp) {
				this.removeInstanceDirectly(systemTmp);
				this.updateSystemEntitySetByRemovedFromManager(systemTmp);
				systemTmp.usedBy.splice(systemTmp.usedBy.indexOf(this), 1);
			}

			return this;
		}

		if (this.elements.has(element.id)) {
			this.removeInstanceDirectly(element);
			this.updateSystemEntitySetByRemovedFromManager(element);
			element.usedBy.splice(element.usedBy.indexOf(this), 1);
		}

		return this;
	}

	public run(world: IWorld, time: number, delta: number): this {
		this.fire(SystemManager.Events.BEFORE_RUN, this);

		this.elements.forEach((item) => {
			item.checkUpdatedEntities(world.entityManager);
			if (!item.disabled) {
				item.run(world, time, delta);
			}
		});
		if (world.entityManager) {
			world.entityManager.updatedEntities.clear();
		}
		this.loopTimes++;

		this.fire(SystemManager.Events.BEFORE_RUN, this);

		return this;
	}

	private updateSystemEntitySetByRemovedFromManager(system: ISystem): this {
		for (const item of this.usedBy) {
			if (item.entityManager) {
				system.entitySet.delete(item.entityManager);
			}
		}

		return this;
	}

	private updateSystemEntitySetByAddFromManager(system: ISystem): this {
		for (const item of this.usedBy) {
			if (item.entityManager) {
				system.checkEntityManager(item.entityManager);
			}
		}

		return this;
	}
}
