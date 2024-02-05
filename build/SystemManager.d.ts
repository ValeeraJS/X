import { Manager } from "./Manager";
import { System, SystemConstructor } from "./System";
import { World } from "./World";
export declare class SystemManager extends Manager<System, World> {
    #private;
    static readonly Events: {
        ADD: string;
        AFTER_RUN: string;
        BEFORE_RUN: string;
        REMOVE: string;
        ADDED: string;
        REMOVED: string;
    };
    disabled: boolean;
    elements: Map<number, System>;
    loopTimes: number;
    add(system: System): this;
    clear(): this;
    remove(element: System | string | number | SystemConstructor): this;
    run(world: World, time: number, delta: number): this;
    updatePriorityOrder(): this;
    private checkUpdatedEntities;
    private updateSystemEntitySetByRemovedFromManager;
    private updateSystemEntitySetByAddFromManager;
}
