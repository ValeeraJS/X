// import EventDispatcher from "@valeera/eventdispatcher";
// import { mixin } from "@valeera/eventdispatcher/src/EventFirer";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import Manager from "./Manager";

let systemTmp: ISystem | undefined;

export enum ESystemEvent {
	BEFORE_RUN = "beforeRun",
	AFTER_RUN = "afterRun"
}

export interface ISystemEventObject {
	eventKey: ESystemEvent;
	manager: ISystemManager;
	target: ISystem;
}

export default class SystemManager extends Manager<ISystem> implements ISystemManager {
	public static readonly AFTER_RUN: ESystemEvent = ESystemEvent.AFTER_RUN;
	public static readonly BEFORE_RUN: ESystemEvent = ESystemEvent.BEFORE_RUN;
	private static eventObject: ISystemEventObject = {
		eventKey: null as any,
		manager: null as any,
		target: null as any
	};

	public disabled = false;
	public elements: Map<string, ISystem> = new Map();
	public loopTimes = 0;
	public usedBy: IWorld[] = [];

	public constructor(world?: IWorld) {
		super();
		if (world) {
			this.usedBy.push(world);
		}
	}

	public addElement(system: ISystem): this {
		if (this.elements.has(system.name)) {
			return this;
		}
		this.elements.set(system.name, system);
		this.updateSystemEntitySetByAddFromManager(system);

		return this;
	}

	public clear(): this {
		this.elements.clear();

		return this;
	}

	public removeByName(name: string): this {
		systemTmp = this.elements.get(name);
		if (systemTmp) {
			this.elements.delete(name);
			this.updateSystemEntitySetByRemovedFromManager(systemTmp);
			systemTmp.usedBy.splice(systemTmp.usedBy.indexOf(this), 1);
		}

		return this;
	}

	public removeByInstance(system: ISystem): this {
		if (this.elements.has(system.name)) {
			this.elements.delete(system.name);
			this.updateSystemEntitySetByRemovedFromManager(system);
			system.usedBy.splice(system.usedBy.indexOf(this), 1);
		}

		return this;
	}

	public run(world: IWorld): this {
		SystemManager.eventObject.eventKey = SystemManager.BEFORE_RUN;
		SystemManager.eventObject.manager = this;
		this.fire(SystemManager.BEFORE_RUN, SystemManager.eventObject);

		this.elements.forEach((item) => {
			item.checkUpdatedEntities(world.entityManager);
			item.run(world);
		});
		if (world.entityManager) {
			world.entityManager.updatedEntities.clear();
		}
		this.loopTimes++;

		SystemManager.eventObject.eventKey = SystemManager.AFTER_RUN;
		this.fire(SystemManager.BEFORE_RUN, SystemManager.eventObject);

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
