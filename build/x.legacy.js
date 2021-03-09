(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@valeera/idgenerator'), require('@valeera/eventdispatcher')) :
	typeof define === 'function' && define.amd ? define(['exports', '@valeera/idgenerator', '@valeera/eventdispatcher'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.X = {}, global.IdGenerator, global.EventDispatcher));
}(this, (function (exports, IdGenerator, EventDispatcher) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var IdGenerator__default = /*#__PURE__*/_interopDefaultLegacy(IdGenerator);
	var EventDispatcher__default = /*#__PURE__*/_interopDefaultLegacy(EventDispatcher);

	var IdGeneratorInstance = new IdGenerator__default['default']();

	var Global = /*#__PURE__*/Object.freeze({
		__proto__: null,
		IdGeneratorInstance: IdGeneratorInstance
	});

	var weakMapTmp;
	var AbstructSystem = /** @class */ (function () {
	    function AbstructSystem(name, fitRule) {
	        this.id = IdGeneratorInstance.next();
	        this.isSystem = true;
	        this.name = "";
	        this.disabled = false;
	        this.loopTimes = 0;
	        this.entitySet = new WeakMap();
	        this.usedBy = [];
	        this.name = name;
	        this.queryRule = fitRule;
	    }
	    AbstructSystem.prototype.query = function (entity) {
	        return this.queryRule(entity);
	    };
	    AbstructSystem.prototype.checkUpdatedEntities = function (manager) {
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
	    AbstructSystem.prototype.checkEntityManager = function (manager) {
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
	    AbstructSystem.prototype.run = function (world, params) {
	        var _this = this;
	        var _a;
	        params.world = world;
	        if (world.entityManager) {
	            (_a = this.entitySet.get(world.entityManager)) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
	                _this.handle(item, params);
	            });
	        }
	        return this;
	    };
	    return AbstructSystem;
	}());

	var Component = /** @class */ (function () {
	    function Component(name, data) {
	        this.isComponent = true;
	        this.data = null;
	        this.disabled = false;
	        this.usedBy = [];
	        this.dirty = false;
	        this.name = name;
	        this.data = data;
	    }
	    Component.prototype.clone = function () {
	        return new Component(this.name, this.data);
	    };
	    return Component;
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

	// 私有全局变量，外部无法访问
	var componentTmp;
	var EComponentEvent;
	(function (EComponentEvent) {
	    EComponentEvent["ADD_COMPONENT"] = "addComponent";
	    EComponentEvent["REMOVE_COMPONENT"] = "removeComponent";
	})(EComponentEvent || (EComponentEvent = {}));
	var ComponentManager = /** @class */ (function () {
	    function ComponentManager() {
	        this.elements = new Map();
	        this.disabled = false;
	        this.usedBy = [];
	        this.isComponentManager = true;
	    }
	    ComponentManager.prototype.add = function (component) {
	        if (this.has(component)) {
	            this.removeByInstance(component);
	        }
	        return this.addComponentDirect(component);
	    };
	    ComponentManager.prototype.addComponentDirect = function (component) {
	        this.elements.set(component.name, component);
	        component.usedBy.push(this);
	        ComponentManager.eventObject = {
	            component: component,
	            eventKey: ComponentManager.ADD_COMPONENT,
	            manager: this,
	            target: component
	        };
	        this.entityComponentChangeDispatch(ComponentManager.ADD_COMPONENT, ComponentManager.eventObject);
	        return this;
	    };
	    ComponentManager.prototype.clear = function () {
	        this.elements.clear();
	        return this;
	    };
	    ComponentManager.prototype.get = function (name) {
	        componentTmp = this.elements.get(name);
	        return componentTmp ? componentTmp : null;
	    };
	    ComponentManager.prototype.has = function (component) {
	        if (typeof component === "string") {
	            return this.elements.has(component);
	        }
	        else {
	            return this.elements.has(component.name);
	        }
	    };
	    // TODO
	    ComponentManager.prototype.isMixedFrom = function (componentManager) {
	        console.log(componentManager);
	        return false;
	    };
	    // TODO
	    ComponentManager.prototype.mixFrom = function (componentManager) {
	        console.log(componentManager);
	        return this;
	    };
	    ComponentManager.prototype.remove = function (component) {
	        return typeof component === "string"
	            ? this.removeByName(component)
	            : this.removeByInstance(component);
	    };
	    ComponentManager.prototype.removeByName = function (name) {
	        componentTmp = this.elements.get(name);
	        if (componentTmp) {
	            this.elements.delete(name);
	            componentTmp.usedBy.splice(componentTmp.usedBy.indexOf(this), 1);
	            ComponentManager.eventObject = {
	                component: componentTmp,
	                eventKey: ComponentManager.REMOVE_COMPONENT,
	                manager: this,
	                target: componentTmp
	            };
	            this.entityComponentChangeDispatch(ComponentManager.REMOVE_COMPONENT, ComponentManager.eventObject);
	        }
	        return this;
	    };
	    ComponentManager.prototype.removeByInstance = function (component) {
	        if (this.elements.has(component.name)) {
	            this.elements.delete(component.name);
	            component.usedBy.splice(component.usedBy.indexOf(this), 1);
	            ComponentManager.eventObject = {
	                component: component,
	                eventKey: ComponentManager.REMOVE_COMPONENT,
	                manager: this,
	                target: component
	            };
	            this.entityComponentChangeDispatch(ComponentManager.REMOVE_COMPONENT, ComponentManager.eventObject);
	        }
	        return this;
	    };
	    ComponentManager.prototype.entityComponentChangeDispatch = function (type, eventObject) {
	        var e_1, _a, e_2, _b;
	        try {
	            for (var _c = __values(this.usedBy), _d = _c.next(); !_d.done; _d = _c.next()) {
	                var entity = _d.value;
	                entity.fire(type, eventObject);
	                try {
	                    for (var _e = (e_2 = void 0, __values(entity.usedBy)), _f = _e.next(); !_f.done; _f = _e.next()) {
	                        var manager = _f.value;
	                        manager.updatedEntities.add(entity);
	                    }
	                }
	                catch (e_2_1) { e_2 = { error: e_2_1 }; }
	                finally {
	                    try {
	                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
	                    }
	                    finally { if (e_2) throw e_2.error; }
	                }
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	    };
	    ComponentManager.ADD_COMPONENT = EComponentEvent.ADD_COMPONENT;
	    ComponentManager.REMOVE_COMPONENT = EComponentEvent.REMOVE_COMPONENT;
	    ComponentManager.eventObject = {
	        component: null,
	        eventKey: null,
	        manager: null,
	        target: null
	    };
	    return ComponentManager;
	}());

	var arr$1;
	var Entity = /** @class */ (function (_super) {
	    __extends(Entity, _super);
	    function Entity(name, componentManager) {
	        var _this = _super.call(this) || this;
	        _this.id = IdGeneratorInstance.next();
	        _this.isEntity = true;
	        _this.name = "";
	        _this.usedBy = [];
	        _this.name = name;
	        _this.registerComponentManager(componentManager);
	        return _this;
	    }
	    Entity.prototype.addComponent = function (component) {
	        if (this.componentManager) {
	            this.componentManager.add(component);
	        }
	        else {
	            throw new Error("Current entity hasn't registered a component manager yet.");
	        }
	        return this;
	    };
	    Entity.prototype.addTo = function (manager) {
	        manager.add(this);
	        return this;
	    };
	    Entity.prototype.addToWorld = function (world) {
	        if (world.entityManager) {
	            world.entityManager.add(this);
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
	            this.componentManager.remove(component);
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
	}(EventDispatcher__default['default']));

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
	    EntityManager.prototype.add = function (entity) {
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
	    EntityManager.prototype.remove = function (entity) {
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
	    SystemManager.prototype.add = function (system) {
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
	    SystemManager.prototype.get = function (name) {
	        systemTmp = this.elements.get(name);
	        return systemTmp ? systemTmp : null;
	    };
	    SystemManager.prototype.has = function (element) {
	        if (typeof element === "string") {
	            return this.elements.has(element);
	        }
	        else {
	            return this.elements.has(element.name);
	        }
	    };
	    SystemManager.prototype.remove = function (system) {
	        return typeof system === "string"
	            ? this.removeByName(system)
	            : this.removeByInstance(system);
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
	    SystemManager.prototype.run = function (world, params) {
	        SystemManager.eventObject.eventKey = SystemManager.BEFORE_RUN;
	        SystemManager.eventObject.manager = this;
	        this.fire(SystemManager.BEFORE_RUN, SystemManager.eventObject);
	        this.elements.forEach(function (item) {
	            item.checkUpdatedEntities(world.entityManager);
	            item.run(world, params);
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
	}(EventDispatcher__default['default']));

	var arr;
	var World = /** @class */ (function () {
	    function World(name, entityManager, systemManager) {
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
	            this.entityManager.add(entity);
	        }
	        else {
	            throw new Error("The world doesn't have an entityManager yet.");
	        }
	        return this;
	    };
	    World.prototype.addSystem = function (system) {
	        if (this.systemManager) {
	            this.systemManager.add(system);
	        }
	        else {
	            throw new Error("The world doesn't have a systemManager yet.");
	        }
	        return this;
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
	            this.entityManager.remove(entity);
	        }
	        return this;
	    };
	    World.prototype.removeSystem = function (system) {
	        if (this.systemManager) {
	            this.systemManager.remove(system);
	        }
	        return this;
	    };
	    World.prototype.run = function (params) {
	        if (this.systemManager) {
	            this.systemManager.run(this, params);
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

	exports.AbstructSystem = AbstructSystem;
	exports.Component = Component;
	exports.ComponentManager = ComponentManager;
	exports.Entity = Entity;
	exports.Entitymanager = EntityManager;
	exports.Global = Global;
	exports.SystemManager = SystemManager;
	exports.World = World;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=x.legacy.js.map
