import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import EventDispatcher from "@valeera/eventdispatcher";

let systemTmp: ISystem<any> | undefined;

export enum ESystemEvent {
	BEFORE_RUN = "beforeRun",
	AFTER_RUN = "afterRun"
};

export type SystemEventObject = {
	type: ESystemEvent,
	manager: SystemManager<any>,
};

export default class SystemManager<T> extends EventDispatcher implements ISystemManager<T> {
	public disabled = false;
	public elements: Map<string, ISystem<T>> = new Map();
	public loopTimes: number = 0;
	public usedBy: IWorld<T>[] = [];
	public static readonly AFTER_RUN: ESystemEvent = ESystemEvent.AFTER_RUN;
	public static readonly BEFORE_RUN: ESystemEvent = ESystemEvent.BEFORE_RUN;
	private static eventObject: SystemEventObject = {} as SystemEventObject;

	public constructor(world?: IWorld<T>) {
		super();
		if (world) {
			this.usedBy.push(world);
		}
	}

	public add(system: ISystem<T>): this {
		if (this.elements.has(system.name)) {
			return this;
		}
		this.elements.set(system.name, system);

		return this;
	}

	public clear(): this {
		this.elements.clear();

		return this;
	}

	public get(name: string): ISystem<T> | null {
		systemTmp = this.elements.get(name);

		return systemTmp ? systemTmp : null;
	}
	
	public has(element: string | ISystem<T>): boolean {
		if (typeof element === 'string') {
			return this.elements.has(element);
		} else {
			return this.elements.has(element.name);
		}
	};

	public remove(system: ISystem<T> | string): this {
		return typeof system === "string"
			? this.removeByName(system)
			: this.removeByInstance(system);
	}

	public removeByName(name: string): this {
		systemTmp = this.elements.get(name);
		if (systemTmp) {
			this.elements.delete(name);
			systemTmp.usedBy.splice(systemTmp.usedBy.indexOf(this), 1);
		}

		return this;
	}

	public removeByInstance(system: ISystem<T>): this {
		if (this.elements.has(system.name)) {
			this.elements.delete(system.name);
			system.usedBy.splice(system.usedBy.indexOf(this), 1);
		}

		return this;
	}

	public run(world: IWorld<T>, params?: T): this {
		SystemManager.eventObject.type = SystemManager.BEFORE_RUN;
		SystemManager.eventObject.manager = this;
		this.dispatchEvent(SystemManager.BEFORE_RUN, SystemManager.eventObject);

		this.elements.forEach((item) => {
			item.checkUpdatedEntities(world.entityManager);
			item.run(world, params);
		});
		if (world.entityManager) {
			world.entityManager.updatedEntities.clear();
		}
		this.loopTimes++;

		SystemManager.eventObject.type = SystemManager.AFTER_RUN;
		this.dispatchEvent(SystemManager.BEFORE_RUN, SystemManager.eventObject);

		return this;
	};
}
