import ISystem from "./ISystem";
import IWorld from "./IWorld";
import IManager from "./IManager";
export default interface ISystemManager<T> extends IManager<ISystem<T>> {
    disabled: boolean;
    loopTimes: number;
    usedBy: IWorld<T>[];
    run: (world: IWorld<T>, params?: T) => this;
}
