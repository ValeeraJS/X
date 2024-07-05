import { Entity } from "./Entity";
import { IdGeneratorInstance } from "./Global";
import { World, updateOrder } from "./World";

export type TQueryRule = (entity: Entity) => boolean;

export class System {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isSystem = true;
	public name = "";
	public loopTimes = 0;
	public entitySet: WeakMap<World, Set<Entity>> = new WeakMap();
	public usedBy: World[] = [];
	public autoUpdate = true;
	public handler: (entity: Entity, time: number, delta: number, world: World) => any;

	protected currentDelta: number = 0;
	protected currentTime: number = 0;
	protected currentWorld: World | null = null;
	protected rule: TQueryRule;
	private _disabled = false;
	private _priority = 0;

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
			updateOrder(this.usedBy[i]);
		}
	}

	public constructor(
		fitRule: TQueryRule,
		handler?: (entity: Entity, time: number, delta: number, world: World) => any,
		name?: string,
	) {
		this.name = name ?? this.constructor.name;
		this.disabled = false;
		this.handler = handler ?? (() => {});
		this.rule = fitRule;
	}

	public checkEntityManager(world: World): this {
		let weakMapTmp = this.entitySet.get(world);
		if (!weakMapTmp) {
			weakMapTmp = new Set();
			this.entitySet.set(world, weakMapTmp);
		} else {
			weakMapTmp.clear();
		}
		world.entities.forEach((item: Entity) => {
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

		this.entitySet.get(world)?.forEach((item: Entity) => {
			// 此处不应该校验disabled。这个交给各自系统自行判断
			this.handle(item, time, delta, world);
		});

		return this;
	}

	public destroy(): this {
		for (let i = this.usedBy.length - 1; i > -1; i--) {
			this.usedBy[i].remove(this);
		}

		return this;
	}

	public handle(entity: Entity, time: number, delta: number, world: World): this {
		this.handler(entity, time, delta, world);

		return this;
	}
}

export type SystemConstructor = new (...a: any[]) => System;
