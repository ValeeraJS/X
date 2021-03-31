import IWorld, { TWorldInjection } from "./interfaces/IWorld";
import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";

type TQueryRule = (entity: IEntity) => boolean;
let weakMapTmp: Set<IEntity> | undefined;

export default abstract class ASystem implements ISystem {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isSystem = true;
	public name = "";
	public disabled = false;
	public loopTimes = 0;
	public entitySet: WeakMap<IEntityManager, Set<IEntity>> = new WeakMap();
	public usedBy: ISystemManager[] = [];
	private queryRule: TQueryRule;

	public constructor(name = "", fitRule: TQueryRule) {
		this.name = name;
		this.queryRule = fitRule;
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
		return this.queryRule(entity);
	}

	public run(world: IWorld): this {
		if (world.entityManager) {
			this.entitySet.get(world.entityManager)?.forEach((item: IEntity) => {
				this.handle(item, world.store);
			});
		}

		return this;
	}

	public abstract destroy(): void;
	public abstract handle(entity: IEntity, params: TWorldInjection): this;
}
