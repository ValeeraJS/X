(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.X = {}));
})(this, (function (exports) { 'use strict';

	const RefWeakMap = new WeakMap();
	const allFilter = () => true;

	function checkFilt(firer, eventKey, target) {
	    for (const item of firer.filters) {
	        if (item.rule(eventKey, target)) {
	            item.listener(target, eventKey);
	        }
	    }
	    return firer;
	}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	const mixin$1 = (Base = Object) => {
	    return class EventFirer extends Base {
	        filters;
	        listeners;
	        constructor(...args) {
	            super(...args);
	            this.filters = [];
	            this.listeners = new Map();
	            RefWeakMap.set(this, {
	                fireIndex: -1,
	                isFire: false,
	                offCount: new Map()
	            });
	        }
	        all(listener, checkDuplicate) {
	            return this.filt(allFilter, listener, checkDuplicate);
	        }
	        clearListenersByKey(eventKey) {
	            this.listeners.delete(eventKey);
	            return this;
	        }
	        clearAllListeners() {
	            const keys = this.listeners.keys();
	            for (const key of keys) {
	                this.listeners.delete(key);
	            }
	            return this;
	        }
	        filt(rule, listener, checkDuplicate) {
	            if (checkDuplicate) {
	                let f;
	                for (let i = 0, j = this.filters.length; i < j; i++) {
	                    f = this.filters[i];
	                    if (f.rule === rule && f.listener === listener) {
	                        return this;
	                    }
	                }
	            }
	            this.filters.push({
	                listener,
	                rule
	            });
	            return this;
	        }
	        fire(eventKey, target) {
	            if (eventKey instanceof Array) {
	                for (let i = 0, len = eventKey.length; i < len; i++) {
	                    this.fire(eventKey[i], target);
	                }
	                return this;
	            }
	            const ref = RefWeakMap.get(this);
	            ref.isFire = true;
	            const array = this.listeners.get(eventKey) || [];
	            // let len = array.length;
	            let item;
	            for (let i = 0; i < array.length; i++) {
	                ref.fireIndex = i;
	                item = array[i];
	                item.listener(target);
	                item.times--;
	                if (item.times <= 0) {
	                    array.splice(i--, 1);
	                }
	                const count = ref.offCount.get(eventKey);
	                if (count) {
	                    // 如果在当前事件触发时，监听器依次触发，已触发的被移除
	                    i -= count;
	                    ref.offCount.clear();
	                }
	            }
	            checkFilt(this, eventKey, target);
	            ref.fireIndex = -1;
	            ref.offCount.clear();
	            ref.isFire = false;
	            return this;
	        }
	        off(eventKey, listener) {
	            const array = this.listeners.get(eventKey);
	            const ref = RefWeakMap.get(this);
	            if (!array) {
	                return this;
	            }
	            const len = array.length;
	            for (let i = 0; i < len; i++) {
	                if (array[i].listener === listener) {
	                    array.splice(i, 1);
	                    if (ref.isFire && ref.fireIndex >= i) {
	                        const v = ref.offCount.get(eventKey) ?? 0;
	                        ref.offCount.set(eventKey, v + 1);
	                    }
	                    break;
	                }
	            }
	            return this;
	        }
	        on(eventKey, listener, checkDuplicate) {
	            if (eventKey instanceof Array) {
	                for (let i = 0, j = eventKey.length; i < j; i++) {
	                    this.times(eventKey[i], Infinity, listener, checkDuplicate);
	                }
	                return this;
	            }
	            return this.times(eventKey, Infinity, listener, checkDuplicate);
	        }
	        once(eventKey, listener, checkDuplicate) {
	            return this.times(eventKey, 1, listener, checkDuplicate);
	        }
	        times(eventKey, times, listener, checkDuplicate = false) {
	            const array = this.listeners.get(eventKey) || [];
	            if (!this.listeners.has(eventKey)) {
	                this.listeners.set(eventKey, array);
	            }
	            if (checkDuplicate) {
	                for (let i = 0, j = array.length; i < j; i++) {
	                    if (array[i].listener === listener) {
	                        return this;
	                    }
	                }
	            }
	            array.push({
	                listener,
	                times
	            });
	            return this;
	        }
	    };
	};
	const EventFirer = mixin$1(Object);

	// const S4 = () => {
	// 	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	// };
	/**
	 * @class
	 * @classdesc 数字id生成器，用于生成递增id
	 * @param {number} [initValue = 0] 从几开始生成递增id
	 * @implements IdGenerator.IIncreaser
	 */
	class IdGenerator {
	    initValue;
	    #value;
	    /**
	     * @member IdGenerator.initValue
	     * @desc id从该值开始递增，在创建实例时进行设置。设置之后将无法修改。
	     * @readonly
	     * @public
	     */
	    constructor(initValue = 0) {
	        this.#value = this.initValue = initValue;
	    }
	    /**
	     * @method IdGenerator.prototype.current
	     * @desc 返回当前的id
	     * @readonly
	     * @public
	     * @returns {number} id
	     */
	    current() {
	        return this.#value;
	    }
	    jumpTo(value) {
	        if (this.#value < value) {
	            this.#value = value;
	            return true;
	        }
	        return false;
	    }
	    /**
	     * @method IdGenerator.prototype.next
	     * @desc 生成新的id
	     * @public
	     * @returns {number} id
	     */
	    next() {
	        return ++this.#value;
	    }
	    /**
	     * @method IdGenerator.prototype.skip
	     * @desc 跳过一段值生成新的id
	     * @public
	     * @param {number} [value = 1] 跳过的范围，必须大于等于1
	     * @returns {number} id
	     */
	    skip(value = 1) {
	        this.#value += Math.min(1, value);
	        return ++this.#value;
	    }
	    /**
	     * @method IdGenerator.prototype.skip
	     * @desc 生成新的32位uuid
	     * @public
	     * @returns {string} uuid
	     */
	    uuid() {
	        // if (crypto.randomUUID) {
	        // 	return (crypto as any).randomUUID();
	        // } else {
	        // 	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
	        // }
	        return crypto.randomUUID();
	    }
	    /**
	     * @method IdGenerator.prototype.skip
	     * @desc 生成新的32位BigInt
	     * @public
	     * @returns {BigInt} uuid
	     */
	    uuidBigInt() {
	        // return bi4(7) + bi4(6) + bi4(5) + bi4(4) + bi4(3) + bi4(2) + bi4(1) + bi4(0);
	        const arr = crypto.getRandomValues(new Uint16Array(8));
	        return (BigInt(arr[0]) * 65536n * 65536n * 65536n * 65536n * 65536n * 65536n * 65536n +
	            BigInt(arr[1]) * 65536n * 65536n * 65536n * 65536n * 65536n * 65536n +
	            BigInt(arr[2]) * 65536n * 65536n * 65536n * 65536n * 65536n +
	            BigInt(arr[3]) * 65536n * 65536n * 65536n * 65536n +
	            BigInt(arr[4]) * 65536n * 65536n * 65536n +
	            BigInt(arr[5]) * 65536n * 65536n +
	            BigInt(arr[6]) * 65536n +
	            BigInt(arr[6]));
	    }
	}

	const IdGeneratorInstance = new IdGenerator();

	let weakMapTmp;
	class System extends EventFirer {
	    id = IdGeneratorInstance.next();
	    isSystem = true;
	    name = "";
	    loopTimes = 0;
	    entitySet = new WeakMap();
	    usedBy = [];
	    cache = new WeakMap();
	    autoUpdate = true;
	    currentDelta = 0;
	    currentTime = 0;
	    currentWorld = null;
	    rule;
	    _disabled = false;
	    _priority = 0;
	    get disabled() {
	        return this._disabled;
	    }
	    set disabled(value) {
	        this._disabled = value;
	    }
	    get priority() {
	        return this._priority;
	    }
	    set priority(v) {
	        this._priority = v;
	        for (let i = 0, len = this.usedBy.length; i < len; i++) {
	            this.usedBy[i].updatePriorityOrder();
	        }
	    }
	    constructor(name = "Untitled System", fitRule) {
	        super();
	        this.name = name;
	        this.disabled = false;
	        this.rule = fitRule;
	    }
	    checkUpdatedEntities(manager) {
	        if (manager) {
	            weakMapTmp = this.entitySet.get(manager);
	            if (!weakMapTmp) {
	                weakMapTmp = new Set();
	                this.entitySet.set(manager, weakMapTmp);
	            }
	            manager.updatedEntities.forEach((item) => {
	                if (this.query(item)) {
	                    weakMapTmp.add(item);
	                }
	                else {
	                    weakMapTmp.delete(item);
	                }
	            });
	        }
	        return this;
	    }
	    checkEntityManager(manager) {
	        if (manager) {
	            weakMapTmp = this.entitySet.get(manager);
	            if (!weakMapTmp) {
	                weakMapTmp = new Set();
	                this.entitySet.set(manager, weakMapTmp);
	            }
	            else {
	                weakMapTmp.clear();
	            }
	            manager.elements.forEach((item) => {
	                if (this.query(item)) {
	                    weakMapTmp.add(item);
	                }
	                else {
	                    weakMapTmp.delete(item);
	                }
	            });
	        }
	        return this;
	    }
	    query(entity) {
	        return this.rule(entity);
	    }
	    run(world, time, delta) {
	        if (this.disabled) {
	            return this;
	        }
	        this.handleBefore(time, delta, world);
	        if (world.entityManager) {
	            this.entitySet.get(world.entityManager)?.forEach((item) => {
	                // 此处不应该校验disabled。这个交给各自系统自行判断
	                this.handle(item, time, delta, world);
	            });
	        }
	        return this;
	    }
	    serialize() {
	        return {};
	    }
	    destroy() {
	        for (let i = this.usedBy.length - 1; i > -1; i--) {
	            this.usedBy[i].remove(this);
	        }
	        return this;
	    }
	    handleBefore(time, delta, world) {
	        this.currentTime = time;
	        this.currentDelta = delta;
	        this.currentWorld = world;
	        this.loopTimes++;
	        return this;
	    }
	}

	class PureSystem extends System {
	    handler;
	    constructor(name = "Untitled PureSystem", fitRule, handler) {
	        super(name, fitRule);
	        this.handler = handler;
	    }
	    handle(entity, time, delta) {
	        this.handler(entity, time, delta);
	        return this;
	    }
	}

	class Component {
	    static unserialize(json) {
	        const component = new Component(json.name, json.data);
	        component.disabled = json.disabled;
	        return component;
	    }
	    isComponent = true;
	    id = IdGeneratorInstance.next();
	    data;
	    disabled = false;
	    name;
	    usedBy = [];
	    tags;
	    #dirty = false;
	    get dirty() {
	        return this.#dirty;
	    }
	    set dirty(v) {
	        this.#dirty = v;
	    }
	    constructor(name, data, tags = []) {
	        this.name = name;
	        this.data = data;
	        this.tags = tags;
	    }
	    clone() {
	        return new Component(this.name, this.data, this.tags);
	    }
	    // 此处为只要tag标签相同就是同一类
	    hasTagLabel(label) {
	        for (let i = this.tags.length - 1; i > -1; i--) {
	            if (this.tags[i].label === label) {
	                return true;
	            }
	        }
	        return false;
	    }
	    serialize() {
	        return {
	            data: this.data,
	            disabled: this.disabled,
	            id: this.id,
	            name: this.name,
	            tags: this.tags,
	            type: "component",
	        };
	    }
	}

	// 私有全局变量，外部无法访问
	let elementTmp;
	const ElementChangeEvent = {
	    ADD: "add",
	    REMOVE: "remove",
	};
	class Manager extends EventFirer {
	    static Events = ElementChangeEvent;
	    elements = new Map();
	    disabled = false;
	    usedBy = [];
	    isManager = true;
	    add(element) {
	        if (this.has(element)) {
	            return this;
	        }
	        return this.addElementDirectly(element);
	    }
	    clear() {
	        this.elements.clear();
	        return this;
	    }
	    get(name) {
	        if (typeof name === "number") {
	            return this.elements.get(name) || null;
	        }
	        if (typeof name === "function" && name.prototype) {
	            for (const [, item] of this.elements) {
	                if (item instanceof name) {
	                    return item;
	                }
	            }
	        }
	        for (const [, item] of this.elements) {
	            if (item.name === name) {
	                return item;
	            }
	        }
	        return null;
	    }
	    has(element) {
	        if (typeof element === "number") {
	            return this.elements.has(element);
	        }
	        else if (typeof element === "string") {
	            // eslint-disable-next-line @typescript-eslint/no-unused-vars
	            for (const [_, item] of this.elements) {
	                if (item.name === element) {
	                    return true;
	                }
	            }
	            return false;
	        }
	        else {
	            return this.elements.has(element.id);
	        }
	    }
	    remove(element) {
	        if (typeof element === "number" || typeof element === "string") {
	            elementTmp = this.get(element);
	            if (elementTmp) {
	                this.removeInstanceDirectly(elementTmp);
	            }
	            return this;
	        }
	        if (this.elements.has(element.id)) {
	            return this.removeInstanceDirectly(element);
	        }
	        return this;
	    }
	    addElementDirectly(element) {
	        this.elements.set(element.id, element);
	        element.usedBy.push(this);
	        this.elementChangedFireEvent(Manager.Events.ADD, this);
	        return this;
	    }
	    // 必定有element情况
	    removeInstanceDirectly(element) {
	        this.elements.delete(element.id);
	        element.usedBy.splice(element.usedBy.indexOf(this), 1);
	        this.elementChangedFireEvent(Manager.Events.REMOVE, this);
	        return this;
	    }
	    elementChangedFireEvent(type, eventObject) {
	        for (const entity of this.usedBy) {
	            entity.fire?.(type, eventObject);
	            if (entity.usedBy) {
	                for (const manager of entity.usedBy) {
	                    manager.updatedEntities.add(entity);
	                }
	            }
	        }
	    }
	}

	exports.EComponentEvent = void 0;
	(function (EComponentEvent) {
	    EComponentEvent["ADD_COMPONENT"] = "addComponent";
	    EComponentEvent["REMOVE_COMPONENT"] = "removeComponent";
	})(exports.EComponentEvent || (exports.EComponentEvent = {}));
	class ComponentManager extends Manager {
	    isComponentManager = true;
	    add(element) {
	        if (this.has(element)) {
	            return this;
	        }
	        const componentSet = this.checkedComponentsWithTargetTags(element);
	        for (const item of componentSet) {
	            this.removeInstanceDirectly(item);
	        }
	        return this.addElementDirectly(element);
	    }
	    getComponentsByClass(clazz) {
	        const result = [];
	        this.elements.forEach((component) => {
	            if (component instanceof clazz) {
	                result.push(component);
	            }
	        });
	        return result;
	    }
	    getComponentByClass(clazz) {
	        for (const [, component] of this.elements) {
	            if (component instanceof clazz) {
	                return component;
	            }
	        }
	        return null;
	    }
	    getComponentsByTagLabel(label) {
	        const result = [];
	        this.elements.forEach((component) => {
	            if (component.hasTagLabel(label)) {
	                result.push(component);
	            }
	        });
	        return result;
	    }
	    getComponentByTagLabel(label) {
	        for (const [, component] of this.elements) {
	            if (component.hasTagLabel(label)) {
	                return component;
	            }
	        }
	        return null;
	    }
	    // 找到所有含目标组件唯一标签一致的组件。只要有任意1个标签符合就行。此处规定名称一致的tag，unique也必须是一致的。且不可修改
	    checkedComponentsWithTargetTags(component) {
	        const result = new Set();
	        let arr;
	        for (let i = component.tags.length - 1; i > -1; i--) {
	            if (component.tags[i].unique) {
	                arr = this.getComponentsByTagLabel(component.tags[i].label);
	                if (arr.length) {
	                    for (let j = arr.length - 1; j > -1; j--) {
	                        result.add(arr[j]);
	                    }
	                }
	            }
	        }
	        return result;
	    }
	}

	const FIND_LEAVES_VISITOR = {
	    enter: (node, result) => {
	        if (!node.children.length) {
	            result.push(node);
	        }
	    }
	};
	const ARRAY_VISITOR = {
	    enter: (node, result) => {
	        result.push(node);
	    }
	};
	const mixin = (Base = Object) => {
	    return class TreeNode extends (Base) {
	        static mixin = mixin;
	        static addChild(node, child) {
	            if (TreeNode.hasAncestor(node, child)) {
	                throw new Error("The node added is one of the ancestors of current one.");
	            }
	            node.children.push(child);
	            child.parent = node;
	            return node;
	        }
	        static depth(node) {
	            if (!node.children.length) {
	                return 1;
	            }
	            else {
	                const childrenDepth = [];
	                for (const item of node.children) {
	                    item && childrenDepth.push(this.depth(item));
	                }
	                let max = 0;
	                for (const item of childrenDepth) {
	                    max = Math.max(max, item);
	                }
	                return 1 + max;
	            }
	        }
	        static findLeaves(node) {
	            const result = [];
	            TreeNode.traverse(node, FIND_LEAVES_VISITOR, result);
	            return result;
	        }
	        static findRoot(node) {
	            if (node.parent) {
	                return this.findRoot(node.parent);
	            }
	            return node;
	        }
	        static hasAncestor(node, ancestor) {
	            if (!node.parent) {
	                return false;
	            }
	            else {
	                if (node.parent === ancestor) {
	                    return true;
	                }
	                else {
	                    return TreeNode.hasAncestor(node.parent, ancestor);
	                }
	            }
	        }
	        static removeChild(node, child) {
	            if (node.children.includes(child)) {
	                node.children.splice(node.children.indexOf(child), 1);
	                child.parent = null;
	            }
	            return node;
	        }
	        static toArray(node) {
	            const result = [];
	            TreeNode.traverse(node, ARRAY_VISITOR, result);
	            return result;
	        }
	        static traverse(node, visitor, rest) {
	            visitor.enter?.(node, rest);
	            visitor.visit?.(node, rest);
	            for (const item of node.children) {
	                item && TreeNode.traverse(item, visitor, rest);
	            }
	            visitor.leave?.(node, rest);
	            return node;
	        }
	        constructor(...rest) {
	            super(...rest);
	        }
	        parent = null;
	        children = [];
	        addChild(node) {
	            return TreeNode.addChild(this, node);
	        }
	        depth() {
	            return TreeNode.depth(this);
	        }
	        findLeaves() {
	            return TreeNode.findLeaves(this);
	        }
	        findRoot() {
	            return TreeNode.findRoot(this);
	        }
	        hasAncestor(ancestor) {
	            return TreeNode.hasAncestor(this, ancestor);
	        }
	        removeChild(child) {
	            return TreeNode.removeChild(this, child);
	        }
	        toArray() {
	            return TreeNode.toArray(this);
	        }
	        traverse(visitor, rest) {
	            return TreeNode.traverse(this, visitor, rest);
	        }
	    };
	};
	const TreeNode = mixin(Object);

	let arr$1;
	class Entity extends mixin$1(TreeNode) {
	    id = IdGeneratorInstance.next();
	    isEntity = true;
	    componentManager = null;
	    disabled = false;
	    name = "";
	    usedBy = [];
	    constructor(name = "Untitled Entity", componentManager) {
	        super();
	        this.name = name;
	        this.registerComponentManager(componentManager);
	    }
	    addComponent(component) {
	        if (this.componentManager) {
	            this.componentManager.add(component);
	        }
	        else {
	            throw new Error("Current entity hasn't registered a component manager yet.");
	        }
	        return this;
	    }
	    addChild(entity) {
	        super.addChild(entity);
	        if (this.usedBy) {
	            for (const manager of this.usedBy) {
	                manager.add(entity);
	            }
	        }
	        return this;
	    }
	    addTo(manager) {
	        manager.add(this);
	        return this;
	    }
	    addToWorld(world) {
	        if (world.entityManager) {
	            world.entityManager.add(this);
	        }
	        return this;
	    }
	    destroy() {
	        for (const manager of this.usedBy) {
	            manager.remove(this);
	        }
	        this.unregisterComponentManager();
	    }
	    getComponent(nameOrId) {
	        return this.componentManager?.get(nameOrId) || null;
	    }
	    getComponentsByTagLabel(label) {
	        return this.componentManager?.getComponentsByTagLabel(label) || [];
	    }
	    getComponentByTagLabel(label) {
	        return this.componentManager?.getComponentByTagLabel(label) || null;
	    }
	    getComponentsByClass(clazz) {
	        return this.componentManager?.getComponentsByClass(clazz) || [];
	    }
	    getComponentByClass(clazz) {
	        return this.componentManager?.getComponentByClass(clazz) || null;
	    }
	    hasComponent(component) {
	        return this.componentManager?.has(component) || false;
	    }
	    registerComponentManager(manager = new ComponentManager()) {
	        this.unregisterComponentManager();
	        this.componentManager = manager;
	        if (!this.componentManager.usedBy.includes(this)) {
	            this.componentManager.usedBy.push(this);
	        }
	        return this;
	    }
	    removeChild(entity) {
	        super.removeChild(entity);
	        if (this.usedBy) {
	            for (const manager of this.usedBy) {
	                manager.remove(entity);
	            }
	        }
	        return this;
	    }
	    removeComponent(component) {
	        if (this.componentManager) {
	            this.componentManager.remove(component);
	        }
	        return this;
	    }
	    serialize() {
	        return {};
	    }
	    unregisterComponentManager() {
	        if (this.componentManager) {
	            arr$1 = this.componentManager.usedBy;
	            arr$1.splice(arr$1.indexOf(this) - 1, 1);
	            this.componentManager = null;
	        }
	        return this;
	    }
	}

	class EntityManager extends Manager {
	    // public elements: Map<string, IEntity> = new Map();
	    data = null;
	    updatedEntities = new Set();
	    isEntityManager = true;
	    constructor(world) {
	        super();
	        if (world) {
	            this.usedBy.push(world);
	        }
	    }
	    createEntity(name) {
	        const entity = new Entity(name);
	        this.add(entity);
	        return entity;
	    }
	    addElementDirectly(entity) {
	        super.addElementDirectly(entity);
	        this.updatedEntities.add(entity);
	        for (const child of entity.children) {
	            if (child) {
	                this.add(child);
	            }
	        }
	        return this;
	    }
	    removeInstanceDirectly(entity) {
	        super.removeInstanceDirectly(entity);
	        this.deleteEntityFromSystemSet(entity);
	        for (const child of entity.children) {
	            if (child) {
	                this.remove(child);
	            }
	        }
	        return this;
	    }
	    deleteEntityFromSystemSet(entity) {
	        entity.usedBy.splice(entity.usedBy.indexOf(this), 1);
	        for (const world of this.usedBy) {
	            if (world.systemManager) {
	                world.systemManager.elements.forEach((system) => {
	                    if (system.entitySet.get(this)) {
	                        system.entitySet.get(this).delete(entity);
	                    }
	                });
	            }
	        }
	    }
	}

	let systemTmp;
	const SystemEvent = {
	    ADD: "add",
	    AFTER_RUN: "afterRun",
	    BEFORE_RUN: "beforeRun",
	    REMOVE: "remove",
	};
	const sort = (a, b) => a[1].priority - b[1].priority;
	class SystemManager extends Manager {
	    static Events = SystemEvent;
	    disabled = false;
	    elements = new Map();
	    loopTimes = 0;
	    usedBy = [];
	    #systemChunks = [];
	    constructor(world) {
	        super();
	        if (world) {
	            this.usedBy.push(world);
	        }
	    }
	    add(system) {
	        super.add(system);
	        this.updatePriorityOrder();
	        this.updateSystemEntitySetByAddFromManager(system);
	        return this;
	    }
	    clear() {
	        this.elements.clear();
	        return this;
	    }
	    remove(element) {
	        if (typeof element === "number" || typeof element === "string") {
	            systemTmp = this.get(element);
	            if (systemTmp) {
	                this.removeInstanceDirectly(systemTmp);
	                this.updateSystemEntitySetByRemovedFromManager(systemTmp);
	                systemTmp.usedBy.splice(systemTmp.usedBy.indexOf(this), 1);
	            }
	            return this;
	        }
	        if (this.elements.has(element.id)) {
	            this.removeInstanceDirectly(element);
	            this.updateSystemEntitySetByRemovedFromManager(element);
	            element.usedBy.splice(element.usedBy.indexOf(this), 1);
	        }
	        return this;
	    }
	    run(world, time, delta) {
	        this.fire(SystemManager.Events.BEFORE_RUN, this);
	        this.elements.forEach((item) => {
	            item.checkUpdatedEntities(world.entityManager);
	            if (!item.disabled && item.autoUpdate) {
	                item.run(world, time, delta);
	            }
	        });
	        if (world.entityManager) {
	            world.entityManager.updatedEntities.clear();
	        }
	        this.loopTimes++;
	        this.fire(SystemManager.Events.BEFORE_RUN, this);
	        return this;
	    }
	    updatePriorityOrder() {
	        const arr = Array.from(this.elements);
	        arr.sort(sort);
	        this.#systemChunks.length = 0;
	        for (let i = 0; i < arr.length; i++) {
	            this.#systemChunks.push(arr[i][1]);
	        }
	        return this;
	    }
	    updateSystemEntitySetByRemovedFromManager(system) {
	        for (const item of this.usedBy) {
	            if (item.entityManager) {
	                system.entitySet.delete(item.entityManager);
	            }
	        }
	        return this;
	    }
	    updateSystemEntitySetByAddFromManager(system) {
	        for (const item of this.usedBy) {
	            if (item.entityManager) {
	                system.checkEntityManager(item.entityManager);
	            }
	        }
	        return this;
	    }
	}

	let arr;
	class World extends EventFirer {
	    disabled = false;
	    name;
	    entityManager = null;
	    systemManager = null;
	    store = new Map();
	    usedBy = [];
	    id = IdGeneratorInstance.next();
	    isWorld = true;
	    constructor(name = "Untitled World", entityManager, systemManager) {
	        super();
	        this.name = name;
	        this.registerEntityManager(entityManager);
	        this.registerSystemManager(systemManager);
	    }
	    add(element) {
	        if (element.isEntity) {
	            return this.addEntity(element);
	        }
	        else {
	            return this.addSystem(element);
	        }
	    }
	    addEntity(entity) {
	        if (this.entityManager) {
	            this.entityManager.add(entity);
	        }
	        else {
	            throw new Error("The world doesn't have an entityManager yet.");
	        }
	        return this;
	    }
	    addSystem(system) {
	        if (this.systemManager) {
	            this.systemManager.add(system);
	        }
	        else {
	            throw new Error("The world doesn't have a systemManager yet.");
	        }
	        return this;
	    }
	    clearAllEntities() {
	        if (this.entityManager) {
	            this.entityManager.clear();
	        }
	        return this;
	    }
	    createEntity(name) {
	        return this.entityManager?.createEntity(name) || null;
	    }
	    hasEntity(entity) {
	        if (this.entityManager) {
	            return this.entityManager.has(entity);
	        }
	        return false;
	    }
	    hasSystem(system) {
	        if (this.systemManager) {
	            return this.systemManager.has(system);
	        }
	        return false;
	    }
	    registerEntityManager(manager) {
	        this.unregisterEntityManager();
	        this.entityManager = manager || new EntityManager(this);
	        if (!this.entityManager.usedBy.includes(this)) {
	            this.entityManager.usedBy.push(this);
	        }
	        return this;
	    }
	    registerSystemManager(manager) {
	        this.unregisterSystemManager();
	        this.systemManager = manager || new SystemManager(this);
	        if (!this.systemManager.usedBy.includes(this)) {
	            this.systemManager.usedBy.push(this);
	        }
	        return this;
	    }
	    remove(element) {
	        if (element.isEntity) {
	            return this.removeEntity(element);
	        }
	        else {
	            return this.removeSystem(element);
	        }
	    }
	    removeEntity(entity) {
	        if (this.entityManager) {
	            this.entityManager.remove(entity);
	        }
	        return this;
	    }
	    removeSystem(system) {
	        if (this.systemManager) {
	            this.systemManager.remove(system);
	        }
	        return this;
	    }
	    run(time, delta) {
	        if (this.disabled) {
	            return this;
	        }
	        if (this.systemManager) {
	            this.systemManager.run(this, time, delta);
	        }
	        return this;
	    }
	    serialize() {
	        return {
	            id: this.id,
	            name: this.name,
	            type: "world",
	        };
	    }
	    unregisterEntityManager() {
	        if (this.entityManager) {
	            arr = this.entityManager.usedBy;
	            arr.splice(arr.indexOf(this) - 1, 1);
	            this.entityManager = null;
	        }
	        return this;
	    }
	    unregisterSystemManager() {
	        if (this.systemManager) {
	            arr = this.systemManager.usedBy;
	            arr.splice(arr.indexOf(this) - 1, 1);
	            this.entityManager = null;
	        }
	        return this;
	    }
	}

	exports.Component = Component;
	exports.ComponentManager = ComponentManager;
	exports.ElementChangeEvent = ElementChangeEvent;
	exports.Entity = Entity;
	exports.EntityManager = EntityManager;
	exports.IdGeneratorInstance = IdGeneratorInstance;
	exports.Manager = Manager;
	exports.PureSystem = PureSystem;
	exports.System = System;
	exports.SystemEvent = SystemEvent;
	exports.SystemManager = SystemManager;
	exports.World = World;

}));
