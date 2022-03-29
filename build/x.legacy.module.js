import IdGenerator from '@valeera/idgenerator';

var IdGeneratorInstance = new IdGenerator();

var weakMapTmp;
var System = /** @class */ (function () {
    function System(name, fitRule) {
        if (name === void 0) { name = ""; }
        this.id = IdGeneratorInstance.next();
        this.isSystem = true;
        this.name = "";
        this.loopTimes = 0;
        this.entitySet = new WeakMap();
        this.usedBy = [];
        this.cache = new WeakMap();
        this._disabled = false;
        this.name = name;
        this.disabled = false;
        this.rule = fitRule;
    }
    Object.defineProperty(System.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            this._disabled = value;
        },
        enumerable: false,
        configurable: true
    });
    System.prototype.checkUpdatedEntities = function (manager) {
        var _this = this;
        if (manager) {
            weakMapTmp = this.entitySet.get(manager);
            if (!weakMapTmp) {
                weakMapTmp = new Set();
                this.entitySet.set(manager, weakMapTmp);
            }
            manager.updatedEntities.forEach(function (item) {
                if (_this.query(item)) {
                    weakMapTmp.add(item);
                }
                else {
                    weakMapTmp.delete(item);
                }
            });
        }
        return this;
    };
    System.prototype.checkEntityManager = function (manager) {
        var _this = this;
        if (manager) {
            weakMapTmp = this.entitySet.get(manager);
            if (!weakMapTmp) {
                weakMapTmp = new Set();
                this.entitySet.set(manager, weakMapTmp);
            }
            else {
                weakMapTmp.clear();
            }
            manager.elements.forEach(function (item) {
                if (_this.query(item)) {
                    weakMapTmp.add(item);
                }
                else {
                    weakMapTmp.delete(item);
                }
            });
        }
        return this;
    };
    System.prototype.query = function (entity) {
        return this.rule(entity);
    };
    System.prototype.run = function (world) {
        var _this = this;
        var _a;
        if (world.entityManager) {
            (_a = this.entitySet.get(world.entityManager)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                _this.handle(item, world.store);
            });
        }
        return this;
    };
    System.prototype.destroy = function () {
        for (var i = this.usedBy.length - 1; i > -1; i--) {
            this.usedBy[i].removeElement(this);
        }
        return this;
    };
    return System;
}());

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

var PureSystem = /** @class */ (function (_super) {
    __extends(PureSystem, _super);
    function PureSystem(name, fitRule, handler) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this, name, fitRule) || this;
        _this.handler = handler;
        return _this;
    }
    PureSystem.prototype.handle = function (entity, params) {
        this.handler(entity, params);
        return this;
    };
    return PureSystem;
}(System));

var Component = /** @class */ (function () {
    function Component(name, data) {
        if (data === void 0) { data = null; }
        this.isComponent = true;
        this.id = IdGeneratorInstance.next();
        this.data = null;
        this.disabled = false;
        this.usedBy = [];
        this.dirty = false;
        this.name = name;
        this.data = data;
    }
    Component.unserialize = function (json) {
        var component = new Component(json.name, json.data);
        component.disabled = json.disabled;
        return component;
    };
    Component.prototype.clone = function () {
        return new Component(this.name, this.data);
    };
    Component.prototype.serialize = function () {
        return {
            data: this.data,
            disabled: this.disabled,
            name: this.name,
            type: "component"
        };
    };
    return Component;
}());

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var mixin$1 = function (Base, eventKeyList) {
    var _a;
    if (Base === void 0) { Base = Object; }
    if (eventKeyList === void 0) { eventKeyList = []; }
    return _a = /** @class */ (function (_super) {
            __extends(EventFirer, _super);
            function EventFirer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.eventKeyList = eventKeyList;
                /**
                 * store all the filters
                 */
                _this.filters = [];
                /**
                 * store all the listeners by key
                 */
                _this.listeners = new Map();
                return _this;
            }
            EventFirer.prototype.all = function (listener) {
                return this.filt(function () { return true; }, listener);
            };
            EventFirer.prototype.clearListenersByKey = function (eventKey) {
                this.listeners.delete(eventKey);
                return this;
            };
            EventFirer.prototype.clearAllListeners = function () {
                var e_1, _a;
                var keys = this.listeners.keys();
                try {
                    for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                        var key = keys_1_1.value;
                        this.listeners.delete(key);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return this;
            };
            EventFirer.prototype.filt = function (rule, listener) {
                this.filters.push({
                    listener: listener,
                    rule: rule
                });
                return this;
            };
            EventFirer.prototype.fire = function (eventKey, target) {
                if (!this.checkEventKeyAvailable(eventKey)) {
                    console.error("EventDispatcher couldn't dispatch the event since EventKeyList doesn't contains key: ", eventKey);
                    return this;
                }
                var array = this.listeners.get(eventKey) || [];
                var len = array.length;
                var item;
                for (var i = 0; i < len; i++) {
                    item = array[i];
                    item.listener(target);
                    item.times--;
                    if (item.times <= 0) {
                        array.splice(i--, 1);
                        --len;
                    }
                }
                return this.checkFilt(eventKey, target);
            };
            EventFirer.prototype.off = function (eventKey, listener) {
                var array = this.listeners.get(eventKey);
                if (!array) {
                    return this;
                }
                var len = array.length;
                for (var i = 0; i < len; i++) {
                    if (array[i].listener === listener) {
                        array.splice(i, 1);
                        break;
                    }
                }
                return this;
            };
            EventFirer.prototype.on = function (eventKey, listener) {
                if (eventKey instanceof Array) {
                    for (var i = 0, j = eventKey.length; i < j; i++) {
                        this.times(eventKey[i], Infinity, listener);
                    }
                    return this;
                }
                return this.times(eventKey, Infinity, listener);
            };
            EventFirer.prototype.once = function (eventKey, listener) {
                return this.times(eventKey, 1, listener);
            };
            EventFirer.prototype.times = function (eventKey, times, listener) {
                if (!this.checkEventKeyAvailable(eventKey)) {
                    console.error("EventDispatcher couldn't add the listener: ", listener, "since EventKeyList doesn't contains key: ", eventKey);
                    return this;
                }
                var array = this.listeners.get(eventKey) || [];
                if (!this.listeners.has(eventKey)) {
                    this.listeners.set(eventKey, array);
                }
                array.push({
                    listener: listener,
                    times: times
                });
                return this;
            };
            EventFirer.prototype.checkFilt = function (eventKey, target) {
                var e_2, _a;
                try {
                    for (var _b = __values(this.filters), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var item = _c.value;
                        if (item.rule(eventKey, target)) {
                            item.listener(target, eventKey);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return this;
            };
            EventFirer.prototype.checkEventKeyAvailable = function (eventKey) {
                if (this.eventKeyList.length) {
                    return this.eventKeyList.includes(eventKey);
                }
                return true;
            };
            return EventFirer;
        }(Base)),
        _a.mixin = mixin$1,
        _a;
};
var EventFirer = mixin$1(Object);

// 私有全局变量，外部无法访问
var elementTmp;
var EElementChangeEvent;
(function (EElementChangeEvent) {
    EElementChangeEvent["ADD"] = "add";
    EElementChangeEvent["REMOVE"] = "remove";
})(EElementChangeEvent || (EElementChangeEvent = {}));
var Manager = /** @class */ (function (_super) {
    __extends(Manager, _super);
    function Manager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // private static eventObject: EventObject = {
        // 	component: null as any,
        // 	element: null as any,
        // 	eventKey: null as any,
        // 	manager: null as any
        // };
        _this.elements = new Map();
        _this.disabled = false;
        _this.usedBy = [];
        _this.isManager = true;
        return _this;
    }
    Manager.prototype.addElement = function (component) {
        if (this.has(component)) {
            this.removeElementByInstance(component);
        }
        return this.addElementDirect(component);
    };
    Manager.prototype.addElementDirect = function (component) {
        this.elements.set(component.name, component);
        component.usedBy.push(this);
        this.elementChangeDispatch(Manager.Events.ADD, this);
        return this;
    };
    Manager.prototype.clear = function () {
        this.elements.clear();
        return this;
    };
    Manager.prototype.get = function (name) {
        elementTmp = this.elements.get(name);
        return elementTmp ? elementTmp : null;
    };
    Manager.prototype.has = function (component) {
        if (typeof component === "string") {
            return this.elements.has(component);
        }
        else {
            return this.elements.has(component.name);
        }
    };
    Manager.prototype.removeElement = function (component) {
        return typeof component === "string"
            ? this.removeElementByName(component)
            : this.removeElementByInstance(component);
    };
    Manager.prototype.removeElementByName = function (name) {
        elementTmp = this.elements.get(name);
        if (elementTmp) {
            this.elements.delete(name);
            elementTmp.usedBy.splice(elementTmp.usedBy.indexOf(this), 1);
            this.elementChangeDispatch(Manager.Events.REMOVE, this);
        }
        return this;
    };
    Manager.prototype.removeElementByInstance = function (component) {
        if (this.elements.has(component.name)) {
            this.elements.delete(component.name);
            component.usedBy.splice(component.usedBy.indexOf(this), 1);
            this.elementChangeDispatch(Manager.Events.REMOVE, this);
        }
        return this;
    };
    Manager.prototype.elementChangeDispatch = function (type, eventObject) {
        var e_1, _a, e_2, _b;
        var _c, _d;
        try {
            for (var _e = __values(this.usedBy), _f = _e.next(); !_f.done; _f = _e.next()) {
                var entity = _f.value;
                (_d = (_c = entity).fire) === null || _d === void 0 ? void 0 : _d.call(_c, type, eventObject);
                try {
                    for (var _g = (e_2 = void 0, __values(entity.usedBy)), _h = _g.next(); !_h.done; _h = _g.next()) {
                        var manager = _h.value;
                        manager.updatedEntities.add(entity);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Manager.Events = EElementChangeEvent;
    return Manager;
}(EventFirer));

// 私有全局变量，外部无法访问
// let componentTmp: IComponent<any> | undefined;
var EComponentEvent;
(function (EComponentEvent) {
    EComponentEvent["ADD_COMPONENT"] = "addComponent";
    EComponentEvent["REMOVE_COMPONENT"] = "removeComponent";
})(EComponentEvent || (EComponentEvent = {}));
var ComponentManager = /** @class */ (function (_super) {
    __extends(ComponentManager, _super);
    function ComponentManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isComponentManager = true;
        _this.usedBy = [];
        return _this;
    }
    return ComponentManager;
}(Manager));

var FIND_LEAVES_VISITOR = {
    enter: function (node, result) {
        if (!node.children.length) {
            result.push(node);
        }
    }
};
var ARRAY_VISITOR = {
    enter: function (node, result) {
        result.push(node);
    }
};
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
var mixin = function (Base) {
    var _a;
    if (Base === void 0) { Base = Object; }
    return _a = /** @class */ (function (_super) {
            __extends(TreeNode, _super);
            function TreeNode() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.parent = null;
                _this.children = [];
                return _this;
            }
            TreeNode.addNode = function (node, child) {
                if (TreeNode.hasAncestor(node, child)) {
                    throw new Error("The node added is one of the ancestors of current one.");
                }
                node.children.push(child);
                child.parent = node;
                return node;
            };
            TreeNode.depth = function (node) {
                var e_1, _a, e_2, _b;
                if (!node.children.length) {
                    return 1;
                }
                else {
                    var childrenDepth = [];
                    try {
                        for (var _c = __values(node.children), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var item = _d.value;
                            item && childrenDepth.push(this.depth(item));
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    var max = 0;
                    try {
                        for (var childrenDepth_1 = __values(childrenDepth), childrenDepth_1_1 = childrenDepth_1.next(); !childrenDepth_1_1.done; childrenDepth_1_1 = childrenDepth_1.next()) {
                            var item = childrenDepth_1_1.value;
                            max = Math.max(max, item);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (childrenDepth_1_1 && !childrenDepth_1_1.done && (_b = childrenDepth_1.return)) _b.call(childrenDepth_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    return 1 + max;
                }
            };
            TreeNode.findLeaves = function (node) {
                var result = [];
                TreeNode.traverse(node, FIND_LEAVES_VISITOR, result);
                return result;
            };
            TreeNode.findRoot = function (node) {
                if (node.parent) {
                    return this.findRoot(node.parent);
                }
                return node;
            };
            TreeNode.hasAncestor = function (node, ancestor) {
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
            };
            TreeNode.removeNode = function (node, child) {
                if (node.children.includes(child)) {
                    node.children.splice(node.children.indexOf(child), 1);
                    child.parent = null;
                }
                return node;
            };
            TreeNode.toArray = function (node) {
                var result = [];
                TreeNode.traverse(node, ARRAY_VISITOR, result);
                return result;
            };
            TreeNode.traverse = function (node, visitor, rest) {
                var e_3, _a;
                visitor.enter && visitor.enter(node, rest);
                visitor.visit && visitor.visit(node, rest);
                try {
                    for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var item = _c.value;
                        item && TreeNode.traverse(item, visitor, rest);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                visitor.leave && visitor.leave(node, rest);
                return node;
            };
            TreeNode.prototype.addNode = function (node) {
                return TreeNode.addNode(this, node);
            };
            TreeNode.prototype.depth = function () {
                return TreeNode.depth(this);
            };
            TreeNode.prototype.findLeaves = function () {
                return TreeNode.findLeaves(this);
            };
            TreeNode.prototype.findRoot = function () {
                return TreeNode.findRoot(this);
            };
            TreeNode.prototype.hasAncestor = function (ancestor) {
                return TreeNode.hasAncestor(this, ancestor);
            };
            TreeNode.prototype.removeNode = function (child) {
                return TreeNode.removeNode(this, child);
            };
            TreeNode.prototype.toArray = function () {
                return TreeNode.toArray(this);
            };
            TreeNode.prototype.traverse = function (visitor, rest) {
                return TreeNode.traverse(this, visitor, rest);
            };
            return TreeNode;
        }(Base)),
        _a.mixin = mixin,
        _a;
};
var TreeNode = mixin(Object);

var TreeNodeWithEvent = mixin$1(TreeNode);

var arr$1;
var Entity = /** @class */ (function (_super) {
    __extends(Entity, _super);
    function Entity(name, componentManager) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.id = IdGeneratorInstance.next();
        _this.isEntity = true;
        _this.componentManager = null;
        _this.name = "";
        _this.usedBy = [];
        _this.name = name;
        _this.registerComponentManager(componentManager);
        return _this;
    }
    Entity.prototype.addComponent = function (component) {
        if (this.componentManager) {
            this.componentManager.addElement(component);
        }
        else {
            throw new Error("Current entity hasn't registered a component manager yet.");
        }
        return this;
    };
    Entity.prototype.addTo = function (manager) {
        manager.addElement(this);
        return this;
    };
    Entity.prototype.addToWorld = function (world) {
        if (world.entityManager) {
            world.entityManager.addElement(this);
        }
        return this;
    };
    Entity.prototype.getComponent = function (name) {
        return this.componentManager ? this.componentManager.get(name) : null;
    };
    Entity.prototype.hasComponent = function (component) {
        return this.componentManager ? this.componentManager.has(component) : false;
    };
    Entity.prototype.registerComponentManager = function (manager) {
        if (manager === void 0) { manager = new ComponentManager(); }
        this.unregisterComponentManager();
        this.componentManager = manager;
        if (!this.componentManager.usedBy.includes(this)) {
            this.componentManager.usedBy.push(this);
        }
        return this;
    };
    Entity.prototype.removeComponent = function (component) {
        if (this.componentManager) {
            this.componentManager.removeElement(component);
        }
        return this;
    };
    Entity.prototype.unregisterComponentManager = function () {
        if (this.componentManager) {
            arr$1 = this.componentManager.usedBy;
            arr$1.splice(arr$1.indexOf(this) - 1, 1);
            this.componentManager = null;
        }
        return this;
    };
    return Entity;
}(TreeNodeWithEvent));

// 私有全局变量，外部无法访问
var entityTmp;
var EntityManager = /** @class */ (function () {
    function EntityManager(world) {
        this.elements = new Map();
        this.data = null;
        this.disabled = false;
        this.updatedEntities = new Set();
        this.isEntityManager = true;
        this.usedBy = [];
        if (world) {
            this.usedBy.push(world);
        }
    }
    EntityManager.prototype.addElement = function (entity) {
        if (this.has(entity)) {
            this.removeByInstance(entity);
        }
        return this.addComponentDirect(entity);
    };
    EntityManager.prototype.addComponentDirect = function (entity) {
        this.elements.set(entity.name, entity);
        entity.usedBy.push(this);
        this.updatedEntities.add(entity);
        return this;
    };
    EntityManager.prototype.clear = function () {
        this.elements.clear();
        return this;
    };
    EntityManager.prototype.createEntity = function (name) {
        var entity = new Entity(name);
        this.addElement(entity);
        return entity;
    };
    EntityManager.prototype.get = function (name) {
        entityTmp = this.elements.get(name);
        return entityTmp ? entityTmp : null;
    };
    EntityManager.prototype.has = function (entity) {
        if (typeof entity === "string") {
            return this.elements.has(entity);
        }
        else {
            return this.elements.has(entity.name);
        }
    };
    EntityManager.prototype.removeElement = function (entity) {
        return typeof entity === "string"
            ? this.removeByName(entity)
            : this.removeByInstance(entity);
    };
    EntityManager.prototype.removeByName = function (name) {
        entityTmp = this.elements.get(name);
        if (entityTmp) {
            this.elements.delete(name);
            this.deleteEntityFromSystemSet(entityTmp);
        }
        return this;
    };
    EntityManager.prototype.removeByInstance = function (entity) {
        if (this.elements.has(entity.name)) {
            this.elements.delete(entity.name);
            this.deleteEntityFromSystemSet(entity);
        }
        return this;
    };
    EntityManager.prototype.deleteEntityFromSystemSet = function (entity) {
        var e_1, _a;
        var _this = this;
        entity.usedBy.splice(entity.usedBy.indexOf(this), 1);
        try {
            for (var _b = __values(this.usedBy), _c = _b.next(); !_c.done; _c = _b.next()) {
                var world = _c.value;
                if (world.systemManager) {
                    world.systemManager.elements.forEach(function (system) {
                        if (system.entitySet.get(_this)) {
                            system.entitySet.get(_this).delete(entity);
                        }
                    });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return EntityManager;
}());

var systemTmp;
var ESystemEvent;
(function (ESystemEvent) {
    ESystemEvent["BEFORE_RUN"] = "beforeRun";
    ESystemEvent["AFTER_RUN"] = "afterRun";
})(ESystemEvent || (ESystemEvent = {}));
var SystemManager = /** @class */ (function (_super) {
    __extends(SystemManager, _super);
    function SystemManager(world) {
        var _this = _super.call(this) || this;
        _this.disabled = false;
        _this.elements = new Map();
        _this.loopTimes = 0;
        _this.usedBy = [];
        if (world) {
            _this.usedBy.push(world);
        }
        return _this;
    }
    SystemManager.prototype.addElement = function (system) {
        if (this.elements.has(system.name)) {
            return this;
        }
        this.elements.set(system.name, system);
        this.updateSystemEntitySetByAddFromManager(system);
        return this;
    };
    SystemManager.prototype.clear = function () {
        this.elements.clear();
        return this;
    };
    SystemManager.prototype.removeByName = function (name) {
        systemTmp = this.elements.get(name);
        if (systemTmp) {
            this.elements.delete(name);
            this.updateSystemEntitySetByRemovedFromManager(systemTmp);
            systemTmp.usedBy.splice(systemTmp.usedBy.indexOf(this), 1);
        }
        return this;
    };
    SystemManager.prototype.removeByInstance = function (system) {
        if (this.elements.has(system.name)) {
            this.elements.delete(system.name);
            this.updateSystemEntitySetByRemovedFromManager(system);
            system.usedBy.splice(system.usedBy.indexOf(this), 1);
        }
        return this;
    };
    SystemManager.prototype.run = function (world) {
        SystemManager.eventObject.eventKey = SystemManager.BEFORE_RUN;
        SystemManager.eventObject.manager = this;
        this.fire(SystemManager.BEFORE_RUN, SystemManager.eventObject);
        this.elements.forEach(function (item) {
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
    };
    SystemManager.prototype.updateSystemEntitySetByRemovedFromManager = function (system) {
        var e_1, _a;
        try {
            for (var _b = __values(this.usedBy), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.entityManager) {
                    system.entitySet.delete(item.entityManager);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    SystemManager.prototype.updateSystemEntitySetByAddFromManager = function (system) {
        var e_2, _a;
        try {
            for (var _b = __values(this.usedBy), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.entityManager) {
                    system.checkEntityManager(item.entityManager);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this;
    };
    SystemManager.AFTER_RUN = ESystemEvent.AFTER_RUN;
    SystemManager.BEFORE_RUN = ESystemEvent.BEFORE_RUN;
    SystemManager.eventObject = {
        eventKey: null,
        manager: null,
        target: null
    };
    return SystemManager;
}(Manager));

var arr;
var World = /** @class */ (function () {
    function World(name, entityManager, systemManager) {
        if (name === void 0) { name = ""; }
        this.entityManager = null;
        this.systemManager = null;
        this.store = new Map();
        this.id = IdGeneratorInstance.next();
        this.isWorld = true;
        this.name = name;
        this.registerEntityManager(entityManager);
        this.registerSystemManager(systemManager);
    }
    World.prototype.add = function (element) {
        if (element.isEntity) {
            return this.addEntity(element);
        }
        else {
            return this.addSystem(element);
        }
    };
    World.prototype.addEntity = function (entity) {
        if (this.entityManager) {
            this.entityManager.addElement(entity);
        }
        else {
            throw new Error("The world doesn't have an entityManager yet.");
        }
        return this;
    };
    World.prototype.addSystem = function (system) {
        if (this.systemManager) {
            this.systemManager.addElement(system);
        }
        else {
            throw new Error("The world doesn't have a systemManager yet.");
        }
        return this;
    };
    World.prototype.clearAllEntities = function () {
        if (this.entityManager) {
            this.entityManager.clear();
        }
        return this;
    };
    World.prototype.createEntity = function (name) {
        var _a;
        return ((_a = this.entityManager) === null || _a === void 0 ? void 0 : _a.createEntity(name)) || null;
    };
    World.prototype.hasEntity = function (entity) {
        if (this.entityManager) {
            return this.entityManager.has(entity);
        }
        return false;
    };
    World.prototype.hasSystem = function (system) {
        if (this.systemManager) {
            return this.systemManager.has(system);
        }
        return false;
    };
    World.prototype.registerEntityManager = function (manager) {
        this.unregisterEntityManager();
        this.entityManager = manager || new EntityManager(this);
        if (!this.entityManager.usedBy.includes(this)) {
            this.entityManager.usedBy.push(this);
        }
        return this;
    };
    World.prototype.registerSystemManager = function (manager) {
        this.unregisterSystemManager();
        this.systemManager = manager || new SystemManager(this);
        if (!this.systemManager.usedBy.includes(this)) {
            this.systemManager.usedBy.push(this);
        }
        return this;
    };
    World.prototype.remove = function (element) {
        if (element.isEntity) {
            return this.removeEntity(element);
        }
        else {
            return this.removeSystem(element);
        }
    };
    World.prototype.removeEntity = function (entity) {
        if (this.entityManager) {
            this.entityManager.removeElement(entity);
        }
        return this;
    };
    World.prototype.removeSystem = function (system) {
        if (this.systemManager) {
            this.systemManager.removeElement(system);
        }
        return this;
    };
    World.prototype.run = function () {
        if (this.systemManager) {
            this.systemManager.run(this);
        }
        return this;
    };
    World.prototype.unregisterEntityManager = function () {
        if (this.entityManager) {
            arr = this.entityManager.usedBy;
            arr.splice(arr.indexOf(this) - 1, 1);
            this.entityManager = null;
        }
        return this;
    };
    World.prototype.unregisterSystemManager = function () {
        if (this.systemManager) {
            arr = this.systemManager.usedBy;
            arr.splice(arr.indexOf(this) - 1, 1);
            this.entityManager = null;
        }
        return this;
    };
    return World;
}());

export { Component, ComponentManager, Entity, EntityManager as Entitymanager, IdGeneratorInstance, Manager, PureSystem, System, SystemManager, World };
