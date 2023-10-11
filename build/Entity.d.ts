import { IComponent } from "./interfaces/IComponent";
import { ComponentConstructor, IComponentManager } from "./interfaces/IComponentManager";
import { IEntity } from "./interfaces/IEntity";
import { IEntityManager } from "./interfaces/IEntityManager";
import { IWorld } from "./interfaces/IWorld";
declare const Entity_base: (new (...args: any[]) => {
    filters: import("@valeera/eventfire").TFilter[];
    listeners: Map<import("@valeera/eventfire").TEventKey, import("@valeera/eventfire").TListenersValue>;
    all(listener: import("@valeera/eventfire").TListener, checkDuplicate?: boolean | undefined): any;
    clearListenersByKey(eventKey: import("@valeera/eventfire").TEventKey): any;
    clearAllListeners(): any;
    filt(rule: import("@valeera/eventfire").TEventFilter, listener: import("@valeera/eventfire").TListenerFilter, checkDuplicate?: boolean | undefined): any;
    fire(eventKey: import("@valeera/eventfire").TEventKey | import("@valeera/eventfire").TEventKey[], target?: any): any;
    off(eventKey: import("@valeera/eventfire").TEventKey, listener: import("@valeera/eventfire").TListener): any;
    on(eventKey: import("@valeera/eventfire").TEventKey | import("@valeera/eventfire").TEventKey[], listener: import("@valeera/eventfire").TListener, checkDuplicate?: boolean | undefined): any;
    once(eventKey: import("@valeera/eventfire").TEventKey, listener: import("@valeera/eventfire").TListener, checkDuplicate?: boolean | undefined): any;
    times(eventKey: import("@valeera/eventfire").TEventKey, times: number, listener: import("@valeera/eventfire").TListener, checkDuplicate?: boolean | undefined): any;
}) & (new (...rest: any[]) => {
    parent: import("@valeera/tree").ITreeNode<import("@valeera/tree").ITreeNodeData<unknown>> | null;
    children: (import("@valeera/tree").ITreeNode<import("@valeera/tree").ITreeNodeData<unknown>> | null)[];
    addChild(node: import("@valeera/tree").ITreeNodeData<import("@valeera/tree").ITreeNodeData<unknown>>): any;
    depth(): number;
    findLeaves(): import("@valeera/tree").ITreeNodeData<import("@valeera/tree").ITreeNodeData<unknown>>[];
    findRoot(): import("@valeera/tree").ITreeNodeData<import("@valeera/tree").ITreeNodeData<unknown>>;
    hasAncestor(ancestor: import("@valeera/tree").ITreeNodeData<import("@valeera/tree").ITreeNodeData<unknown>>): boolean;
    removeChild(child: import("@valeera/tree").ITreeNodeData<import("@valeera/tree").ITreeNodeData<unknown>>): any;
    toArray(): import("@valeera/tree").ITreeNodeData<import("@valeera/tree").ITreeNodeData<unknown>>[];
    traverse(visitor: import("@valeera/tree").IVisitor<import("@valeera/tree").ITreeNodeData<unknown>>, rest?: any): any;
});
export declare class Entity extends Entity_base implements IEntity {
    readonly id: number;
    readonly isEntity = true;
    componentManager: IComponentManager | null;
    disabled: boolean;
    name: string;
    usedBy: IEntityManager[];
    constructor(componentManager?: IComponentManager, name?: string);
    addComponent(component: IComponent<any>): this;
    addChild(entity: IEntity): this;
    addTo(manager: IEntityManager): this;
    addToWorld(world: IWorld): this;
    clone(cloneComponenT?: Boolean): Entity;
    destroy(): void;
    getComponent(nameOrId: string | number | ComponentConstructor): IComponent<any> | null;
    getComponentsByTagLabel(label: string): IComponent<any>[];
    getComponentByTagLabel(label: string): IComponent<any> | null;
    getComponentsByClass(clazz: ComponentConstructor): IComponent<any>[];
    getComponentByClass(clazz: ComponentConstructor): IComponent<any> | null;
    hasComponent(component: IComponent<any> | string | number): boolean;
    registerComponentManager(manager: IComponentManager): this;
    removeChild(entity: IEntity): this;
    removeComponent(component: IComponent<any> | string): this;
    serialize(): any;
    unregisterComponentManager(): this;
}
export {};
