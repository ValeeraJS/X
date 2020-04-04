import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
import EventDispatcher from "@valeera/eventdispatcher";
export declare enum ESystemEvent {
    BEFORE_RUN = "beforeRun",
    AFTER_RUN = "afterRun"
}
export declare type SystemEventObject = {
    type: ESystemEvent;
    manager: SystemManager<any>;
};
export default class SystemManager<T> extends EventDispatcher implements ISystemManager<T> {
    disabled: boolean;
    elements: Map<string, ISystem<T>>;
    loopTimes: number;
    usedBy: IWorld<T>[];
    static readonly AFTER_RUN: ESystemEvent;
    static readonly BEFORE_RUN: ESystemEvent;
    private static eventObject;
    constructor(world?: IWorld<T>);
    add(system: ISystem<T>): this;
    clear(): this;
    get(name: string): ISystem<T> | null;
    has(element: string | ISystem<T>): boolean;
    remove(system: ISystem<T> | string): this;
    removeByName(name: string): this;
    removeByInstance(system: ISystem<T>): this;
    run(world: IWorld<T>, params?: T): this;
}
