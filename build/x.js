(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@valeera/idgenerator')) :
	typeof define === 'function' && define.amd ? define(['exports', '@valeera/idgenerator'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.X = {}, global.IdGenerator));
})(this, (function (exports, IdGenerator) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var IdGenerator__default = /*#__PURE__*/_interopDefaultLegacy(IdGenerator);

	const IdGeneratorInstance = new IdGenerator__default["default"]();

	let weakMapTmp;
	class System {
	    id = IdGeneratorInstance.next();
	    isSystem = true;
	    name = "";
	    loopTimes = 0;
	    entitySet = new WeakMap();
	    usedBy = [];
	    cache = new WeakMap();
	    rule;
	    _disabled;
	    get disabled() {
	        return this._disabled;
	    }
	    set disabled(value) {
	        this._disabled = value;
	    }
	    constructor(name = "", fitRule) {
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
	    run(world) {
	        if (world.entityManager) {
	            this.entitySet.get(world.entityManager)?.forEach((item) => {
	                this.handle(item, world.store);
	            });
	        }
	        return this;
	    }
	    destroy() {
	        for (let i = this.usedBy.length - 1; i > -1; i--) {
	            this.usedBy[i].removeElement(this);
	        }
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
	    data = null;
	    disabled = false;
	    name;
	    usedBy = [];
	    dirty = false;
	    constructor(name, data = null) {
	        this.name = name;
	        this.data = data;
	    }
	    clone() {
	        return new Component(this.name, this.data);
	    }
	    serialize() {
	        return {
	            data: this.data,
	            disabled: this.disabled,
	            name: this.name,
	            type: "component"
	        };
	    }
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	const mixin$1 = (Base = Object, eventKeyList = []) => {
	    return class EventFirer extends Base {
	        static mixin = mixin$1;
	        eventKeyList = eventKeyList;
	        /**
	         * store all the filters
	         */
	        filters = [];
	        /**
	         * store all the listeners by key
	         */
	        listeners = new Map();
	        all(listener) {
	            return this.filt(() => true, listener);
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
	        filt(rule, listener) {
	            this.filters.push({
	                listener,
	                rule
	            });
	            return this;
	        }
	        fire(eventKey, target) {
	            if (!this.checkEventKeyAvailable(eventKey)) {
	                console.error("EventDispatcher couldn't dispatch the event since EventKeyList doesn't contains key: ", eventKey);
	                return this;
	            }
	            const array = this.listeners.get(eventKey) || [];
	            let len = array.length;
	            let item;
	            for (let i = 0; i < len; i++) {
	                item = array[i];
	                item.listener(target);
	                item.times--;
	                if (item.times <= 0) {
	                    array.splice(i--, 1);
	                    --len;
	                }
	            }
	            return this.checkFilt(eventKey, target);
	        }
	        off(eventKey, listener) {
	            const array = this.listeners.get(eventKey);
	            if (!array) {
	                return this;
	            }
	            const len = array.length;
	            for (let i = 0; i < len; i++) {
	                if (array[i].listener === listener) {
	                    array.splice(i, 1);
	                    break;
	                }
	            }
	            return this;
	        }
	        on(eventKey, listener) {
	            if (eventKey instanceof Array) {
	                for (let i = 0, j = eventKey.length; i < j; i++) {
	                    this.times(eventKey[i], Infinity, listener);
	                }
	                return this;
	            }
	            return this.times(eventKey, Infinity, listener);
	        }
	        once(eventKey, listener) {
	            return this.times(eventKey, 1, listener);
	        }
	        times(eventKey, times, listener) {
	            if (!this.checkEventKeyAvailable(eventKey)) {
	                console.error("EventDispatcher couldn't add the listener: ", listener, "since EventKeyList doesn't contains key: ", eventKey);
	                return this;
	            }
	            const array = this.listeners.get(eventKey) || [];
	            if (!this.listeners.has(eventKey)) {
	                this.listeners.set(eventKey, array);
	            }
	            array.push({
	                listener,
	                times
	            });
	            return this;
	        }
	        checkFilt(eventKey, target) {
	            for (const item of this.filters) {
	                if (item.rule(eventKey, target)) {
	                    item.listener(target, eventKey);
	                }
	            }
	            return this;
	        }
	        checkEventKeyAvailable(eventKey) {
	            if (this.eventKeyList.length) {
	                return this.eventKeyList.includes(eventKey);
	            }
	            return true;
	        }
	    };
	};
	var EventFirer = mixin$1(Object);

	// 私有全局变量，外部无法访问
	let elementTmp;
	var EElementChangeEvent;
	(function (EElementChangeEvent) {
	    EElementChangeEvent["ADD"] = "add";
	    EElementChangeEvent["REMOVE"] = "remove";
	})(EElementChangeEvent || (EElementChangeEvent = {}));
	class Manager extends EventFirer {
	    static Events = EElementChangeEvent;
	    // private static eventObject: EventObject = {
	    // 	component: null as any,
	    // 	element: null as any,
	    // 	eventKey: null as any,
	    // 	manager: null as any
	    // };
	    elements = new Map();
	    disabled = false;
	    usedBy = [];
	    isManager = true;
	    addElement(component) {
	        if (this.has(component)) {
	            this.removeElementByInstance(component);
	        }
	        return this.addElementDirect(component);
	    }
	    addElementDirect(component) {
	        this.elements.set(component.name, component);
	        component.usedBy.push(this);
	        this.elementChangeDispatch(Manager.Events.ADD, this);
	        return this;
	    }
	    clear() {
	        this.elements.clear();
	        return this;
	    }
	    get(name) {
	        elementTmp = this.elements.get(name);
	        return elementTmp ? elementTmp : null;
	    }
	    has(component) {
	        if (typeof component === "string") {
	            return this.elements.has(component);
	        }
	        else {
	            return this.elements.has(component.name);
	        }
	    }
	    removeElement(component) {
	        return typeof component === "string"
	            ? this.removeElementByName(component)
	            : this.removeElementByInstance(component);
	    }
	    removeElementByName(name) {
	        elementTmp = this.elements.get(name);
	        if (elementTmp) {
	            this.elements.delete(name);
	            elementTmp.usedBy.splice(elementTmp.usedBy.indexOf(this), 1);
	            this.elementChangeDispatch(Manager.Events.REMOVE, this);
	        }
	        return this;
	    }
	    removeElementByInstance(component) {
	        if (this.elements.has(component.name)) {
	            this.elements.delete(component.name);
	            component.usedBy.splice(component.usedBy.indexOf(this), 1);
	            this.elementChangeDispatch(Manager.Events.REMOVE, this);
	        }
	        return this;
	    }
	    elementChangeDispatch(type, eventObject) {
	        for (const entity of this.usedBy) {
	            entity.fire?.(type, eventObject);
	            for (const manager of entity.usedBy) {
	                manager.updatedEntities.add(entity);
	            }
	        }
	    }
	}

	// import { IdGeneratorInstance } from "./Global";
	// 私有全局变量，外部无法访问
	// let componentTmp: IComponent<any> | undefined;
	var EComponentEvent;
	(function (EComponentEvent) {
	    EComponentEvent["ADD_COMPONENT"] = "addComponent";
	    EComponentEvent["REMOVE_COMPONENT"] = "removeComponent";
	})(EComponentEvent || (EComponentEvent = {}));
	class ComponentManager extends Manager {
	    isComponentManager;
	    usedBy = [];
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
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	const mixin = (Base = Object) => {
	    return class TreeNode extends Base {
	        parent = null;
	        children = [];
	        static mixin = mixin;
	        static addNode(node, child) {
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
	        static removeNode(node, child) {
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
	            visitor.enter && visitor.enter(node, rest);
	            visitor.visit && visitor.visit(node, rest);
	            for (const item of node.children) {
	                item && TreeNode.traverse(item, visitor, rest);
	            }
	            visitor.leave && visitor.leave(node, rest);
	            return node;
	        }
	        addNode(node) {
	            return TreeNode.addNode(this, node);
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
	        removeNode(child) {
	            return TreeNode.removeNode(this, child);
	        }
	        toArray() {
	            return TreeNode.toArray(this);
	        }
	        traverse(visitor, rest) {
	            return TreeNode.traverse(this, visitor, rest);
	        }
	    };
	};
	var TreeNode = mixin(Object);

	const TreeNodeWithEvent = mixin$1(TreeNode);

	let arr$1;
	class Entity extends TreeNodeWithEvent {
	    id = IdGeneratorInstance.next();
	    isEntity = true;
	    componentManager = null;
	    name = "";
	    usedBy = [];
	    constructor(name = "", componentManager) {
	        super();
	        this.name = name;
	        this.registerComponentManager(componentManager);
	    }
	    addComponent(component) {
	        if (this.componentManager) {
	            this.componentManager.addElement(component);
	        }
	        else {
	            throw new Error("Current entity hasn't registered a component manager yet.");
	        }
	        return this;
	    }
	    addTo(manager) {
	        manager.addElement(this);
	        return this;
	    }
	    addToWorld(world) {
	        if (world.entityManager) {
	            world.entityManager.addElement(this);
	        }
	        return this;
	    }
	    getComponent(name) {
	        return this.componentManager ? this.componentManager.get(name) : null;
	    }
	    hasComponent(component) {
	        return this.componentManager ? this.componentManager.has(component) : false;
	    }
	    registerComponentManager(manager = new ComponentManager()) {
	        this.unregisterComponentManager();
	        this.componentManager = manager;
	        if (!this.componentManager.usedBy.includes(this)) {
	            this.componentManager.usedBy.push(this);
	        }
	        return this;
	    }
	    removeComponent(component) {
	        if (this.componentManager) {
	            this.componentManager.removeElement(component);
	        }
	        return this;
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

	// 私有全局变量，外部无法访问
	let entityTmp;
	class EntityManager {
	    elements = new Map();
	    data = null;
	    disabled = false;
	    updatedEntities = new Set();
	    isEntityManager = true;
	    usedBy = [];
	    constructor(world) {
	        if (world) {
	            this.usedBy.push(world);
	        }
	    }
	    addElement(entity) {
	        if (this.has(entity)) {
	            this.removeByInstance(entity);
	        }
	        return this.addComponentDirect(entity);
	    }
	    addComponentDirect(entity) {
	        this.elements.set(entity.name, entity);
	        entity.usedBy.push(this);
	        this.updatedEntities.add(entity);
	        return this;
	    }
	    clear() {
	        this.elements.clear();
	        return this;
	    }
	    get(name) {
	        entityTmp = this.elements.get(name);
	        return entityTmp ? entityTmp : null;
	    }
	    has(entity) {
	        if (typeof entity === "string") {
	            return this.elements.has(entity);
	        }
	        else {
	            return this.elements.has(entity.name);
	        }
	    }
	    removeElement(entity) {
	        return typeof entity === "string"
	            ? this.removeByName(entity)
	            : this.removeByInstance(entity);
	    }
	    removeByName(name) {
	        entityTmp = this.elements.get(name);
	        if (entityTmp) {
	            this.elements.delete(name);
	            this.deleteEntityFromSystemSet(entityTmp);
	        }
	        return this;
	    }
	    removeByInstance(entity) {
	        if (this.elements.has(entity.name)) {
	            this.elements.delete(entity.name);
	            this.deleteEntityFromSystemSet(entity);
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
	var ESystemEvent;
	(function (ESystemEvent) {
	    ESystemEvent["BEFORE_RUN"] = "beforeRun";
	    ESystemEvent["AFTER_RUN"] = "afterRun";
	})(ESystemEvent || (ESystemEvent = {}));
	class SystemManager extends Manager {
	    static AFTER_RUN = ESystemEvent.AFTER_RUN;
	    static BEFORE_RUN = ESystemEvent.BEFORE_RUN;
	    static eventObject = {
	        eventKey: null,
	        manager: null,
	        target: null
	    };
	    disabled = false;
	    elements = new Map();
	    loopTimes = 0;
	    usedBy = [];
	    constructor(world) {
	        super();
	        if (world) {
	            this.usedBy.push(world);
	        }
	    }
	    addElement(system) {
	        if (this.elements.has(system.name)) {
	            return this;
	        }
	        this.elements.set(system.name, system);
	        this.updateSystemEntitySetByAddFromManager(system);
	        return this;
	    }
	    clear() {
	        this.elements.clear();
	        return this;
	    }
	    removeByName(name) {
	        systemTmp = this.elements.get(name);
	        if (systemTmp) {
	            this.elements.delete(name);
	            this.updateSystemEntitySetByRemovedFromManager(systemTmp);
	            systemTmp.usedBy.splice(systemTmp.usedBy.indexOf(this), 1);
	        }
	        return this;
	    }
	    removeByInstance(system) {
	        if (this.elements.has(system.name)) {
	            this.elements.delete(system.name);
	            this.updateSystemEntitySetByRemovedFromManager(system);
	            system.usedBy.splice(system.usedBy.indexOf(this), 1);
	        }
	        return this;
	    }
	    run(world) {
	        SystemManager.eventObject.eventKey = SystemManager.BEFORE_RUN;
	        SystemManager.eventObject.manager = this;
	        this.fire(SystemManager.BEFORE_RUN, SystemManager.eventObject);
	        this.elements.forEach((item) => {
	            item.checkUpdatedEntities(world.entityManager);
	            item.run(world);
	        });
	        if (world.entityManager) {
	            world.entityManager.updatedEntities.clear();
	        }
	        this.loopTimes++;
	        SystemManager.eventObject.eventKey = SystemManager.AFTER_RUN;
	        this.fire(SystemManager.BEFORE_RUN, SystemManager.eventObject);
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
	class World {
	    name;
	    entityManager = null;
	    systemManager = null;
	    store = new Map();
	    id = IdGeneratorInstance.next();
	    isWorld = true;
	    constructor(name = "", entityManager, systemManager) {
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
	            this.entityManager.addElement(entity);
	        }
	        else {
	            throw new Error("The world doesn't have an entityManager yet.");
	        }
	        return this;
	    }
	    addSystem(system) {
	        if (this.systemManager) {
	            this.systemManager.addElement(system);
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
	            this.entityManager.removeElement(entity);
	        }
	        return this;
	    }
	    removeSystem(system) {
	        if (this.systemManager) {
	            this.systemManager.removeElement(system);
	        }
	        return this;
	    }
	    run() {
	        if (this.systemManager) {
	            this.systemManager.run(this);
	        }
	        return this;
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
	exports.Entity = Entity;
	exports.Entitymanager = EntityManager;
	exports.IdGeneratorInstance = IdGeneratorInstance;
	exports.System = System;
	exports.SystemManager = SystemManager;
	exports.World = World;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=x.js.map
