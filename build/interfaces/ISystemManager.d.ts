import { IManager } from "./IManager";
import { ISystem } from "./ISystem";
import { IWorld } from "./IWorld";
export interface ISystemManager extends IManager<ISystem> {
    disabled: boolean;
    loopTimes: number;
    usedBy: IWorld[];
    run(world: IWorld, time: number, delta: number): this;
    updatePriorityOrder(): this;
}
