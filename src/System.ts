import IWorld, { TWorldInjection } from "./interfaces/IWorld";
import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";

type TQueryRule = (entity: IEntity) => boolean;
let weakMapTmp: Set<IEntity> | undefined;

export default abstract class System implements ISystem {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isSystem = true;
	public name = "";
	public loopTimes = 0;
	public entitySet: WeakMap<IEntityManager, Set<IEntity>> = new WeakMap();
	public usedBy: ISystemManager[] = [];
	public cache: WeakMap<IEntity, any> = new WeakMap();
	protected rule: TQueryRule;
	protected _disabled = false;

	public get disabled(): boolean {
		return this._disabled;
	}

	public set disabled(value: boolean) {
		this._disabled = value;
	}

	public constructor(name = "", fitRule: TQueryRule) {
		this.name = name;
		this.disabled = false;
		this.rule = fitRule;
	}

	public checkUpdatedEntities(manager: IEntityManager | null): this {
		if (manager) {
			weakMapTmp = this.entitySet.get(manager);
			if (!weakMapTmp) {
				weakMapTmp = new Set();
				this.entitySet.set(manager, weakMapTmp);
			}
			manager.updatedEntities.forEach((item: IEntity) => {
				if (this.query(item)) {
					(weakMapTmp as Set<IEntity>).add(item);
				} else {
					(weakMapTmp as Set<IEntity>).delete(item);
				}
			});
		}

		return this;
	}

	public checkEntityManager(manager: IEntityManager | null): this {
		if (manager) {
			weakMapTmp = this.entitySet.get(manager);
			if (!weakMapTmp) {
				weakMapTmp = new Set();
				this.entitySet.set(manager, weakMapTmp);
			} else {
				weakMapTmp.clear();
			}
			manager.elements.forEach((item: IEntity) => {
				if (this.query(item)) {
					(weakMapTmp as Set<IEntity>).add(item);
				} else {
					(weakMapTmp as Set<IEntity>).delete(item);
				}
			});
		}

		return this;
	}

	public query(entity: IEntity): boolean {
		return this.rule(entity);
	}

	public run(world: IWorld): this {
		if (world.entityManager) {
			this.entitySet.get(world.entityManager)?.forEach((item: IEntity) => {
				if (!item.disabled) {
					this.handle(item, world.store);
				}
			});
		}

		return this;
	}

	public destroy(): this {
		for (let i = this.usedBy.length - 1; i > -1; i--) {
			this.usedBy[i].removeElement(this);
		}

		return this;
	}

	public abstract handle(entity: IEntity, params: TWorldInjection): this;
}
