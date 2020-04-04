import { IdGeneratorInstance } from "./Global";
import IEntity from "./interfaces/IEntity";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import IEntityManager from "./interfaces/IEntityManager";

type TFitRule = (entity: IEntity) => boolean;

export default abstract class AbstructSystem<T> implements ISystem<T> {
	public readonly id: number = IdGeneratorInstance.next();
	public readonly isSystem = true;
	public name: string = "";
	public disabled: boolean = false;
	public loopTimes: number = 0;
	public entitySet: Set<IEntity> = new Set();
	public usedBy: ISystemManager<T>[] = [];
	private fitRule: TFitRule;

	public constructor(name: string, fitRule: TFitRule) {
		this.name = name;
		this.fitRule = fitRule;
	}

	public fit(entity: IEntity): boolean {
		return this.fitRule(entity);
	}

	public abstract destroy(): void;
	public abstract handle(entity: IEntity, params?: T): this;

	public checkUpdatedEntities(manager: IEntityManager | null): this {
		if (manager) {
			manager.updatedEntities.forEach((item: IEntity) => {
				if (this.fit(item)) {
					this.entitySet.add(item);
				} else {
					this.entitySet.delete(item);
				}
			});
		}

		return this;
	}

	public run(world: IWorld<T>, params: T): this {
		(params as any).world = world;
		this.entitySet.forEach((item: IEntity) => {
			this.handle(item, params);
		});

		return this;
	}
}
