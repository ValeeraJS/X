import EventDispatcher from "@valeera/eventdispatcher";
import ISystem from "./interfaces/ISystem";
import ISystemManager from "./interfaces/ISystemManager";
import IWorld from "./interfaces/IWorld";
export declare enum ESystemEvent {
    BEFORE_RUN = "beforeRun",
    AFTER_RUN = "afterRun"
}
export interface ISystemEventObject {
    eventKey: ESystemEvent;
    manager: ISystemManager<any>;
    target: ISystem<any>;
}
export default class SystemManager<T> extends EventDispatcher implements ISystemManager<T> {
    static readonly AFTER_RUN: ESystemEvent;
    static readonly BEFORE_RUN: ESystemEvent;
    private static eventObject;
    disabled: boolean;
    elements: Map<string, ISystem<T>>;
    loopTimes: number;
    usedBy: IWorld<T>[];
    constructor(world?: IWorld<T>);
    add(system: ISystem<T>): this;
    clear(): this;
    get(name: string): ISystem<T> | null;
    has(element: string | ISystem<T>): boolean;
    remove(system: ISystem<T> | string): this;
    removeByName(name: string): this;
    removeByInstance(system: ISystem<T>): this;
    run(world: IWorld<T>, params?: T): this;
    private updateSystemEntitySetByRemovedFromManager;
    private updateSystemEntitySetByAddFromManager;
}
