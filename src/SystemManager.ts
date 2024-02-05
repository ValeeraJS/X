import { Entity } from "./Entity";
import { EntityManager } from "./EntityManager";
import { Manager } from "./Manager";
import { System, SystemConstructor } from "./System";
import { World } from "./World";

const SystemEvent = {
	ADD: "add",
	AFTER_RUN: "afterRun",
	BEFORE_RUN: "beforeRun",
	REMOVE: "remove",
	ADDED: "added",
	REMOVED: "removed",
};

const sort = (a: [number, System], b: [number, System]) => a[1].priority - b[1].priority;

export class SystemManager extends Manager<System, World> {
	public static readonly Events = SystemEvent;

	public disabled = false;
	public elements: Map<number, System> = new Map();
	public loopTimes = 0;

	#systemChunks: System[] = [];

	public add(system: System): this {
		super.add(system);
		this.updatePriorityOrder();
		this.updateSystemEntitySetByAddFromManager(system);

		return this;
	}

	public clear(): this {
		this.elements.clear();

		return this;
	}

	public remove(element: System | string | number | SystemConstructor): this {
		if (typeof element === "number" || typeof element === "string") {
			const systemTmp = this.get(element);
			if (systemTmp) {
				this.removeElementDirectly(systemTmp);
				this.updateSystemEntitySetByRemovedFromManager(systemTmp);
				systemTmp.usedBy.splice(systemTmp.usedBy.indexOf(this), 1);
			}
		} else if (element instanceof System) {
			if (this.elements.has(element.id)) {
				this.removeElementDirectly(element);
				this.updateSystemEntitySetByRemovedFromManager(element);
				element.usedBy.splice(element.usedBy.indexOf(this), 1);
			}
		} else {
			this.elements.forEach((system) => {
				if (system instanceof element) {
					this.removeElementDirectly(system);
					this.updateSystemEntitySetByRemovedFromManager(system);
					system.usedBy.splice(system.usedBy.indexOf(this), 1);
				}
			});
		}

		return this;
	}

	public run(world: World, time: number, delta: number): this {
		this.fire(SystemManager.Events.BEFORE_RUN, this);

		this.elements.forEach((item) => {
			this.checkUpdatedEntities(item, world.entityManager);
			if (!item.disabled && item.autoUpdate) {
				item.run(world, time, delta);
			}
		});

		world.entityManager.updatedEntities.clear();
		this.loopTimes++;
		this.fire(SystemManager.Events.BEFORE_RUN, this);

		return this;
	}

	public updatePriorityOrder(): this {
		const arr = Array.from(this.elements);
		arr.sort(sort);
		this.#systemChunks.length = 0;
		for (let i = 0; i < arr.length; i++) {
			this.#systemChunks.push(arr[i][1]);
		}

		return this;
	}

	private checkUpdatedEntities(system: System, manager: EntityManager): this {
		let weakMapTmp = system.entitySet.get(manager);
		manager.updatedEntities.forEach((item: Entity) => {
			if (system.query(item)) {
				weakMapTmp.add(item);
			} else {
				weakMapTmp.delete(item);
			}
		});

		return this;
	}

	private updateSystemEntitySetByRemovedFromManager(system: System): this {
		system.entitySet.delete(this.usedBy.entityManager);

		return this;
	}

	private updateSystemEntitySetByAddFromManager(system: System): this {
		system.checkEntityManager(this.usedBy.entityManager);

		return this;
	}
}
