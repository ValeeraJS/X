import IComponent from "./interfaces/IComponent";
import IComponentManager from "./interfaces/IComponentManager";
import IEntity from "./interfaces/IEntity";
import IEntityManager from "./interfaces/IEntityManager";
import IWorld from "./interfaces/IWorld";
declare const Entity_base: {
    new (...a: any[]): {
        parent: import("@valeera/tree").ITreeNode | null;
        children: (import("@valeera/tree").ITreeNode | null)[];
        addChild(node: import("@valeera/tree").ITreeNodeData): any;
        depth(): number;
        findLeaves(): import("@valeera/tree").ITreeNodeData[];
        findRoot(): import("@valeera/tree").ITreeNodeData;
        hasAncestor(ancestor: import("@valeera/tree").ITreeNodeData): boolean;
        removeChild(child: import("@valeera/tree").ITreeNodeData): any;
        toArray(): import("@valeera/tree").ITreeNodeData[];
        traverse(visitor: import("@valeera/tree").IVisitor, rest?: any): any;
        constructor: Function;
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: PropertyKey): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: PropertyKey): boolean;
        should: Chai.Assertion;
    };
    mixin: any;
    addChild(node: import("@valeera/tree").ITreeNodeData, child: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
    depth(node: import("@valeera/tree").ITreeNodeData): number;
    findLeaves(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData[];
    findRoot(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
    hasAncestor(node: import("@valeera/tree").ITreeNodeData, ancestor: import("@valeera/tree").ITreeNodeData): boolean;
    removeChild(node: import("@valeera/tree").ITreeNodeData, child: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
    toArray(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData[];
    traverse(node: import("@valeera/tree").ITreeNodeData, visitor: import("@valeera/tree").IVisitor, rest?: any): import("@valeera/tree").ITreeNodeData;
} & {
    new (...a: any[]): {
        "__#5@#isFire": boolean;
        "__#5@#fireIndex": number;
        "__#5@#offCount": Map<import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey, number>;
        eventKeyList: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey[];
        filters: import("@valeera/eventfirer/build/interfaces/IEventFirer").TFilter[];
        listeners: Map<import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey, import("@valeera/eventfirer/build/interfaces/IEventFirer").TListenersValue>;
        all(listener: import("@valeera/eventfirer/build/interfaces/IEventFirer").TListener): any;
        clearListenersByKey(eventKey: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey): any;
        clearAllListeners(): any;
        filt(rule: Function, listener: import("@valeera/eventfirer/build/interfaces/IEventFirer").TListener): any;
        fire(eventKey: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey | import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey[], target?: any): any;
        off(eventKey: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey, listener: import("@valeera/eventfirer/build/interfaces/IEventFirer").TListener): any;
        on(eventKey: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey | import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey[], listener: import("@valeera/eventfirer/build/interfaces/IEventFirer").TListener): any;
        once(eventKey: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey, listener: import("@valeera/eventfirer/build/interfaces/IEventFirer").TListener): any;
        times(eventKey: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey, times: number, listener: import("@valeera/eventfirer/build/interfaces/IEventFirer").TListener): any;
        checkFilt(eventKey: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey, target: any): any;
        checkEventKeyAvailable(eventKey: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey): boolean;
        constructor: Function;
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: PropertyKey): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: PropertyKey): boolean;
        should: Chai.Assertion;
    };
    mixin: (Base?: (new (...a: any[]) => Object) | undefined, eventKeyList?: import("@valeera/eventfirer/build/interfaces/IEventFirer").TEventKey[] | undefined) => any;
};
export default class Entity extends Entity_base implements IEntity {
    readonly id: number;
    readonly isEntity = true;
    componentManager: IComponentManager | null;
    disabled: boolean;
    name: string;
    usedBy: IEntityManager[];
    constructor(name?: string, componentManager?: IComponentManager);
    addComponent(component: IComponent<any>): this;
    addChild(entity: IEntity): this;
    addTo(manager: IEntityManager): this;
    addToWorld(world: IWorld): this;
    destroy(): void;
    getComponent(nameOrId: string | number): IComponent<any> | null;
    getComponentsByTagLabel(label: string): IComponent<any>[];
    getFirstComponentByTagLabel(label: string): IComponent<any> | null;
    hasComponent(component: IComponent<any> | string | number): boolean;
    registerComponentManager(manager?: IComponentManager): this;
    removeChild(entity: IEntity): this;
    removeComponent(component: IComponent<any> | string): this;
    serialize(): any;
    unregisterComponentManager(): this;
}
export {};
