import { EventFirer } from "@valeera/eventfire";
import { Entity } from "./Entity";
import { EntityManager } from "./EntityManager";
import { IdGeneratorInstance } from "./Global";
import { ISystemSerializedJson } from "./interfaces/ISerializable";
import { SystemManager } from "./SystemManager";
import { World } from "./World";

type TQueryRule = (entity: Entity) => boolean;

export type SystemConstructor = new (...a: any[]) => System;

export class System extends EventFirer {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isSystem = true;
	public name = "";
	public loopTimes = 0;
	public entitySet: WeakMap<EntityManager, Set<Entity>> = new WeakMap();
	public usedBy: SystemManager[] = [];
	public cache: WeakMap<Entity, any> = new WeakMap();
	public autoUpdate = true;

	protected currentDelta: number = 0;
	protected currentTime: number = 0;
	protected currentWorld: World | null = null;
	protected rule: TQueryRule;
	protected _disabled = false;
	protected _priority = 0;

	#handler: (entity: Entity, time: number, delta: number, world: World) => any;
	#handlerBefore?: (time: number, delta: number, world: World) => any;
	#handlerAfter?: (time: number, delta: number, world: World) => any;

	public get disabled(): boolean {
		return this._disabled;
	}

	public set disabled(value: boolean) {
		this._disabled = value;
	}

	public get priority(): number {
		return this._priority;
	}

	public set priority(v: number) {
		this._priority = v;

		for (let i = 0, len = this.usedBy.length; i < len; i++) {
			this.usedBy[i].updatePriorityOrder();
		}
	}

	public constructor(
		fitRule: TQueryRule,
		handler: (entity: Entity, time: number, delta: number, world: World) => any,
		handlerBefore?: (time: number, delta: number, world: World) => any,
		handlerAfter?: (time: number, delta: number, world: World) => any,
		name?: string,
	) {
		super();
		this.name = name ?? this.constructor.name;
		this.disabled = false;
		this.#handler = handler;
		this.#handlerAfter = handlerAfter;
		this.#handlerBefore = handlerBefore;
		this.rule = fitRule;
	}

	public checkEntityManager(manager: EntityManager): this {
		let weakMapTmp = this.entitySet.get(manager);
		if (!weakMapTmp) {
			weakMapTmp = new Set();
			this.entitySet.set(manager, weakMapTmp);
		} else {
			weakMapTmp.clear();
		}
		manager.elements.forEach((item: Entity) => {
			if (this.query(item)) {
				weakMapTmp.add(item);
			} else {
				weakMapTmp.delete(item);
			}
		});

		return this;
	}

	public query(entity: Entity): boolean {
		return this.rule(entity);
	}

	public run(world: World, time: number, delta: number): this {
		if (this.disabled) {
			return this;
		}

		this.handleBefore(time, delta, world);
		this.entitySet.get(world.entityManager)?.forEach((item: Entity) => {
			// 此处不应该校验disabled。这个交给各自系统自行判断
			this.handle(item, time, delta, world);
		});
		this.handleAfter?.(time, delta, world);

		return this;
	}

	public serialize(): ISystemSerializedJson {
		return {
			id: this.id,
			name: this.name,
			autoUpdate: this.autoUpdate,
			priority: this.priority,
			disabled: this.disabled,
			class: this.constructor.name,
		};
	}

	public destroy(): this {
		for (let i = this.usedBy.length - 1; i > -1; i--) {
			this.usedBy[i].remove(this);
		}

		return this;
	}

	public handle(entity: Entity, time: number, delta: number, world: World): this {
		this.#handler(entity, time, delta, world);

		return this;
	}

	public handleAfter(time: number, delta: number, world: World): this {
		this.#handlerAfter?.(time, delta, world);

		return this;
	}

	public handleBefore(time: number, delta: number, world: World): this {
		this.currentTime = time;
		this.currentDelta = delta;
		this.currentWorld = world;
		this.loopTimes++;

		this.#handlerBefore?.(time, delta, world);

		return this;
	}
}
