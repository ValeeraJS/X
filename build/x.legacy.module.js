import IdGenerator from '@valeera/idgenerator';
import EventFirer, { mixin } from '@valeera/eventdispatcher';
import { TreeNode } from '@valeera/tree';

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
        this.isComponent = true;
        this.id = IdGeneratorInstance.next();
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
    Manager.prototype.addElement = function (element) {
        if (this.has(element)) {
            this.removeElementByInstance(element);
        }
        return this.addElementDirect(element);
    };
    Manager.prototype.addElementDirect = function (element) {
        this.elements.set(element.name, element);
        element.usedBy.push(this);
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
    Manager.prototype.has = function (element) {
        if (typeof element === "string") {
            return this.elements.has(element);
        }
        else {
            return this.elements.has(element.name);
        }
    };
    Manager.prototype.removeElement = function (element) {
        return typeof element === "string"
            ? this.removeElementByName(element)
            : this.removeElementByInstance(element);
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
    Manager.prototype.removeElementByInstance = function (element) {
        if (this.elements.has(element.name)) {
            this.elements.delete(element.name);
            element.usedBy.splice(element.usedBy.indexOf(this), 1);
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
                if (entity.usedBy) {
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

var TreeNodeWithEvent = mixin(TreeNode);

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
var EntityManager = /** @class */ (function (_super) {
    __extends(EntityManager, _super);
    function EntityManager(world) {
        var _this = _super.call(this) || this;
        // public elements: Map<string, IEntity> = new Map();
        _this.data = null;
        _this.updatedEntities = new Set();
        _this.isEntityManager = true;
        if (world) {
            _this.usedBy.push(world);
        }
        return _this;
    }
    EntityManager.prototype.addElementDirect = function (entity) {
        var e_1, _a;
        _super.prototype.addElementDirect.call(this, entity);
        this.updatedEntities.add(entity);
        try {
            for (var _b = __values(entity.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child) {
                    this.addElement(child);
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
    EntityManager.prototype.createEntity = function (name) {
        var entity = new Entity(name);
        this.addElement(entity);
        return entity;
    };
    EntityManager.prototype.removeElementByName = function (name) {
        var e_2, _a;
        entityTmp = this.elements.get(name);
        if (entityTmp) {
            _super.prototype.removeElementByName.call(this, name);
            this.deleteEntityFromSystemSet(entityTmp);
            try {
                for (var _b = __values(entityTmp === null || entityTmp === void 0 ? void 0 : entityTmp.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child) {
                        this.removeElementByInstance(child);
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
        }
        return this;
    };
    EntityManager.prototype.removeElementByInstance = function (entity) {
        var e_3, _a;
        if (this.elements.has(entity.name)) {
            _super.prototype.removeElementByInstance.call(this, entity);
            this.deleteEntityFromSystemSet(entity);
            try {
                for (var _b = __values(entity.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child) {
                        this.removeElementByInstance(child);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return this;
    };
    EntityManager.prototype.deleteEntityFromSystemSet = function (entity) {
        var e_4, _a;
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
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    return EntityManager;
}(Manager));

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
        _super.prototype.addElement.call(this, system);
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
