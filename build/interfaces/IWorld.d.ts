import IEntityManager from "./IEntityManager";
import ISystemManager from "./ISystemManager";
export default interface IWorld<T> {
    name: string;
    entityManager: IEntityManager | null;
    systemManager: ISystemManager<T> | null;
    run: (params?: T) => this;
}
