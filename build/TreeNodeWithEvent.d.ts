declare const TreeNodeWithEvent: {
    new (...a: any[]): {
        eventKeyList: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey[];
        filters: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TFilter<any>[];
        listeners: Map<import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListenersValue<any>>;
        all: (listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
        clearListenersByKey: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey) => any;
        clearAllListeners: () => any;
        filt: (rule: Function, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
        fire: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, target: any) => any;
        off: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
        on: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
        once: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
        times: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, times: number, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
        checkFilt: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, target: any) => any;
        checkEventKeyAvailable: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey) => boolean;
    };
    mixin: <TBase extends new (...a: any[]) => {}>(Base?: TBase, eventKeyList?: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey[]) => {
        new (...a: any[]): {
            eventKeyList: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey[];
            filters: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TFilter<any>[];
            listeners: Map<import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListenersValue<any>>;
            all: (listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
            clearListenersByKey: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey) => any;
            clearAllListeners: () => any;
            filt: (rule: Function, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
            fire: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, target: any) => any;
            off: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
            on: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
            once: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
            times: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, times: number, listener: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TListener<any>) => any;
            checkFilt: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey, target: any) => any;
            checkEventKeyAvailable: (eventKey: import("@valeera/eventdispatcher/src/interfaces/IEventDispatcher").TEventKey) => boolean;
        };
        mixin: any;
    } & TBase;
} & {
    new (...a: any[]): {
        parent: import("@valeera/tree/src/interfaces/ITreeNode").default | null;
        children: (import("@valeera/tree/src/interfaces/ITreeNode").default | null)[];
        addNode(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): any;
        depth(): number;
        findLeaves(): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData[];
        findRoot(): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
        hasAncestor(ancestor: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): boolean;
        removeNode(child: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): any;
        toArray(): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData[];
        traverse(visitor: import("@valeera/tree/src/interfaces/IVisitor").default, rest?: any): any;
    };
    mixin: <TBase_1 extends new (...a: any[]) => {}>(Base?: TBase_1) => {
        new (...a: any[]): {
            parent: import("@valeera/tree/src/interfaces/ITreeNode").default | null;
            children: (import("@valeera/tree/src/interfaces/ITreeNode").default | null)[];
            addNode(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): any;
            depth(): number;
            findLeaves(): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData[];
            findRoot(): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
            hasAncestor(ancestor: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): boolean;
            removeNode(child: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): any;
            toArray(): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData[];
            traverse(visitor: import("@valeera/tree/src/interfaces/IVisitor").default, rest?: any): any;
        };
        mixin: any;
        addNode(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData, child: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
        depth(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): number;
        findLeaves(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData[];
        findRoot(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
        hasAncestor(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData, ancestor: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): boolean;
        removeNode(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData, child: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
        toArray(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData[];
        traverse(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData, visitor: import("@valeera/tree/src/interfaces/IVisitor").default, rest?: any): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
    } & TBase_1;
    addNode(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData, child: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
    depth(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): number;
    findLeaves(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData[];
    findRoot(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
    hasAncestor(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData, ancestor: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): boolean;
    removeNode(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData, child: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
    toArray(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData[];
    traverse(node: import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData, visitor: import("@valeera/tree/src/interfaces/IVisitor").default, rest?: any): import("@valeera/tree/src/interfaces/ITreeNode").ITreeNodeData;
} & ObjectConstructor;
export default TreeNodeWithEvent;
