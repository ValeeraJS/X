import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import IEntityManager from "./interfaces/IEntityManager";

type TQueryRule = (entity: IEntity) => boolean;
let weakMapTmp: Set<IEntity> | undefined;

export default abstract class AbstructSystem<T> implements ISystem<T> {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isSystem = true;
	public name: string = "";
	public disabled: boolean = false;
	public loopTimes: number = 0;
	public entitySet: WeakMap<IEntityManager, Set<IEntity>>  = new WeakMap();
	public usedBy: ISystemManager<T>[] = [];
	private queryRule: TQueryRule;

	public constructor(name: string, fitRule: TQueryRule) {
		this.name = name;
		this.queryRule = fitRule;
	}

	public query(entity: IEntity): boolean {
		return this.queryRule(entity);
	}

	public abstract destroy(): void;
	public abstract handle(entity: IEntity, params?: T): this;

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

	public run(world: IWorld<T>, params: T): this {
		(params as any).world = world;
		if (world.entityManager) {
			this.entitySet.get(world.entityManager)?.forEach((item: IEntity) => {
				this.handle(item, params);
			});
		}

		return this;
	}
}
