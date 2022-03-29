declare const TreeNodeWithEvent: {
    new (...a: any[]): {
        eventKeyList: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey[];
        filters: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TFilter<any>[];
        listeners: Map<import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey, import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TListenersValue<any>>;
        all: (listener: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TListener<any>) => any;
        clearListenersByKey: (eventKey: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey) => any;
        clearAllListeners: () => any;
        filt: (rule: Function, listener: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TListener<any>) => any;
        fire: (eventKey: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey, target: any) => any;
        off: (eventKey: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TListener<any>) => any;
        on: (eventKey: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TListener<any>) => any;
        once: (eventKey: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TListener<any>) => any;
        times: (eventKey: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey, times: number, listener: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TListener<any>) => any;
        checkFilt: (eventKey: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey, target: any) => any;
        checkEventKeyAvailable: (eventKey: import("@valeera/eventdispatcher/build/interfaces/IEventDispatcher").TEventKey) => boolean;
    };
    mixin: any;
} & {
    new (...a: any[]): {
        parent: import("@valeera/tree").ITreeNode | null;
        children: (import("@valeera/tree").ITreeNode | null)[];
        addNode(node: import("@valeera/tree").ITreeNodeData): any;
        depth(): number;
        findLeaves(): import("@valeera/tree").ITreeNodeData[];
        findRoot(): import("@valeera/tree").ITreeNodeData;
        hasAncestor(ancestor: import("@valeera/tree").ITreeNodeData): boolean;
        removeNode(child: import("@valeera/tree").ITreeNodeData): any;
        toArray(): import("@valeera/tree").ITreeNodeData[];
        traverse(visitor: import("@valeera/tree").IVisitor, rest?: any): any;
    };
    mixin: <TBase extends new (...a: any[]) => {}>(Base?: TBase | undefined) => {
        new (...a: any[]): {
            parent: import("@valeera/tree").ITreeNode | null;
            children: (import("@valeera/tree").ITreeNode | null)[];
            addNode(node: import("@valeera/tree").ITreeNodeData): any;
            depth(): number;
            findLeaves(): import("@valeera/tree").ITreeNodeData[];
            findRoot(): import("@valeera/tree").ITreeNodeData;
            hasAncestor(ancestor: import("@valeera/tree").ITreeNodeData): boolean;
            removeNode(child: import("@valeera/tree").ITreeNodeData): any;
            toArray(): import("@valeera/tree").ITreeNodeData[];
            traverse(visitor: import("@valeera/tree").IVisitor, rest?: any): any;
        };
        mixin: any;
        addNode(node: import("@valeera/tree").ITreeNodeData, child: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
        depth(node: import("@valeera/tree").ITreeNodeData): number;
        findLeaves(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData[];
        findRoot(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
        hasAncestor(node: import("@valeera/tree").ITreeNodeData, ancestor: import("@valeera/tree").ITreeNodeData): boolean;
        removeNode(node: import("@valeera/tree").ITreeNodeData, child: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
        toArray(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData[];
        traverse(node: import("@valeera/tree").ITreeNodeData, visitor: import("@valeera/tree").IVisitor, rest?: any): import("@valeera/tree").ITreeNodeData;
    } & TBase;
    addNode(node: import("@valeera/tree").ITreeNodeData, child: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
    depth(node: import("@valeera/tree").ITreeNodeData): number;
    findLeaves(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData[];
    findRoot(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
    hasAncestor(node: import("@valeera/tree").ITreeNodeData, ancestor: import("@valeera/tree").ITreeNodeData): boolean;
    removeNode(node: import("@valeera/tree").ITreeNodeData, child: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData;
    toArray(node: import("@valeera/tree").ITreeNodeData): import("@valeera/tree").ITreeNodeData[];
    traverse(node: import("@valeera/tree").ITreeNodeData, visitor: import("@valeera/tree").IVisitor, rest?: any): import("@valeera/tree").ITreeNodeData;
} & ObjectConstructor;
export default TreeNodeWithEvent;
