import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import Manager from "./Manager";
export declare enum ESystemEvent {
    BEFORE_RUN = "beforeRun",
    AFTER_RUN = "afterRun"
}
export interface ISystemEventObject {
    eventKey: ESystemEvent;
    manager: ISystemManager;
    target: ISystem;
}
export default class SystemManager extends Manager<ISystem> implements ISystemManager {
    static readonly AFTER_RUN: ESystemEvent;
    static readonly BEFORE_RUN: ESystemEvent;
    private static eventObject;
    disabled: boolean;
    elements: Map<string, ISystem>;
    loopTimes: number;
    usedBy: IWorld[];
    constructor(world?: IWorld);
    addElement(system: ISystem): this;
    clear(): this;
    removeByName(name: string): this;
    removeByInstance(system: ISystem): this;
    run(world: IWorld): this;
    private updateSystemEntitySetByRemovedFromManager;
    private updateSystemEntitySetByAddFromManager;
}
