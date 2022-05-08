import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import Manager from "./Manager";
export declare const SystemEvent: {
    ADD: string;
    AFTER_RUN: string;
    BEFORE_RUN: string;
    REMOVE: string;
};
export default class SystemManager extends Manager<ISystem> implements ISystemManager {
    static readonly Events: {
        ADD: string;
        AFTER_RUN: string;
        BEFORE_RUN: string;
        REMOVE: string;
    };
    disabled: boolean;
    elements: Map<number, ISystem>;
    loopTimes: number;
    usedBy: IWorld[];
    constructor(world?: IWorld);
    add(system: ISystem): this;
    clear(): this;
    remove(element: ISystem | string | number): this;
    run(world: IWorld): this;
    private updateSystemEntitySetByRemovedFromManager;
    private updateSystemEntitySetByAddFromManager;
}
