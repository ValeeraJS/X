(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@valeera/idgenerator'), require('@valeera/eventdispatcher'), require('@valeera/tree')) :
	typeof define === 'function' && define.amd ? define(['exports', '@valeera/idgenerator', '@valeera/eventdispatcher', '@valeera/tree'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.X = {}, global.IdGenerator, global.EventDispatcher, global.Tree));
})(this, (function (exports, IdGenerator, EventFirer, tree) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var IdGenerator__default = /*#__PURE__*/_interopDefaultLegacy(IdGenerator);
	var EventFirer__default = /*#__PURE__*/_interopDefaultLegacy(EventFirer);

	var IdGeneratorInstance = new IdGenerator__default["default"]();

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
	                if (!item.disabled) {
	                    _this.handle(item, world.store);
	                }
	            });
	        }
	        return this;
	    };
	    System.prototype.serialize = function () {
	        return {};
	    };
	    System.prototype.destroy = function () {
	        for (var i = this.usedBy.length - 1; i > -1; i--) {
	            this.usedBy[i].remove(this);
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

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
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
	    function Component(name, data, tags) {
	        if (tags === void 0) { tags = []; }
	        this.isComponent = true;
	        this.id = IdGeneratorInstance.next();
	        this.disabled = false;
	        this.usedBy = [];
	        this.dirty = false;
	        this.name = name;
	        this.data = data;
	        this.tags = tags;
	    }
	    Component.unserialize = function (json) {
	        var component = new Component(json.name, json.data);
	        component.disabled = json.disabled;
	        return component;
	    };
	    Component.prototype.clone = function () {
	        return new Component(this.name, this.data, this.tags);
	    };
	    // 此处为只要tag标签相同就是同一类
	    Component.prototype.hasTagLabel = function (label) {
	        for (var i = this.tags.length - 1; i > -1; i--) {
	            if (this.tags[i].label === label) {
	                return true;
	            }
	        }
	        return false;
	    };
	    Component.prototype.serialize = function () {
	        return {
	            data: this.data,
	            disabled: this.disabled,
	            id: this.id,
	            name: this.name,
	            tags: this.tags,
	            type: "component"
	        };
	    };
	    return Component;
	}());

	// 私有全局变量，外部无法访问
	var elementTmp;
	var ElementChangeEvent = {
	    ADD: "add",
	    REMOVE: "remove"
	};
	var Manager = /** @class */ (function (_super) {
	    __extends(Manager, _super);
	    function Manager() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.elements = new Map();
	        _this.disabled = false;
	        _this.usedBy = [];
	        _this.isManager = true;
	        return _this;
	    }
	    Manager.prototype.add = function (element) {
	        if (this.has(element)) {
	            return this;
	        }
	        return this.addElementDirectly(element);
	    };
	    Manager.prototype.clear = function () {
	        this.elements.clear();
	        return this;
	    };
	    Manager.prototype.get = function (name) {
	        var e_1, _a;
	        if (typeof name === "number") {
	            return this.elements.get(name) || null;
	        }
	        try {
	            // eslint-disable-next-line @typescript-eslint/no-unused-vars
	            for (var _b = __values(this.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var _d = __read(_c.value, 2), _ = _d[0], item = _d[1];
	                if (item.name === name) {
	                    return item;
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
	        return null;
	    };
	    Manager.prototype.has = function (element) {
	        var e_2, _a;
	        if (typeof element === "number") {
	            return this.elements.has(element);
	        }
	        else if (typeof element === "string") {
	            try {
	                // eslint-disable-next-line @typescript-eslint/no-unused-vars
	                for (var _b = __values(this.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
	                    var _d = __read(_c.value, 2), _ = _d[0], item = _d[1];
	                    if (item.name === element) {
	                        return true;
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
	            return false;
	        }
	        else {
	            return this.elements.has(element.id);
	        }
	    };
	    Manager.prototype.remove = function (element) {
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
	    };
	    Manager.prototype.addElementDirectly = function (element) {
	        this.elements.set(element.id, element);
	        element.usedBy.push(this);
	        this.elementChangedFireEvent(Manager.Events.ADD, this);
	        return this;
	    };
	    // 必定有element情况
	    Manager.prototype.removeInstanceDirectly = function (element) {
	        this.elements.delete(element.id);
	        element.usedBy.splice(element.usedBy.indexOf(this), 1);
	        this.elementChangedFireEvent(Manager.Events.REMOVE, this);
	        return this;
	    };
	    Manager.prototype.elementChangedFireEvent = function (type, eventObject) {
	        var e_3, _a, e_4, _b;
	        var _c, _d;
	        try {
	            for (var _e = __values(this.usedBy), _f = _e.next(); !_f.done; _f = _e.next()) {
	                var entity = _f.value;
	                (_d = (_c = entity).fire) === null || _d === void 0 ? void 0 : _d.call(_c, type, eventObject);
	                if (entity.usedBy) {
	                    try {
	                        for (var _g = (e_4 = void 0, __values(entity.usedBy)), _h = _g.next(); !_h.done; _h = _g.next()) {
	                            var manager = _h.value;
	                            manager.updatedEntities.add(entity);
	                        }
	                    }
	                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
	                    finally {
	                        try {
	                            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
	                        }
	                        finally { if (e_4) throw e_4.error; }
	                    }
	                }
	            }
	        }
	        catch (e_3_1) { e_3 = { error: e_3_1 }; }
	        finally {
	            try {
	                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
	            }
	            finally { if (e_3) throw e_3.error; }
	        }
	    };
	    Manager.Events = ElementChangeEvent;
	    return Manager;
	}(EventFirer__default["default"]));

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
	        return _this;
	    }
	    ComponentManager.prototype.add = function (element) {
	        var e_1, _a;
	        if (this.has(element)) {
	            return this;
	        }
	        var componentSet = this.checkedComponentsWithTargetTags(element);
	        try {
	            for (var componentSet_1 = __values(componentSet), componentSet_1_1 = componentSet_1.next(); !componentSet_1_1.done; componentSet_1_1 = componentSet_1.next()) {
	                var item = componentSet_1_1.value;
	                this.removeInstanceDirectly(item);
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (componentSet_1_1 && !componentSet_1_1.done && (_a = componentSet_1.return)) _a.call(componentSet_1);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	        return this.addElementDirectly(element);
	    };
	    ComponentManager.prototype.getComponentsByTagLabel = function (label) {
	        var e_2, _a;
	        var result = [];
	        try {
	            for (var _b = __values(this.elements), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var _d = __read(_c.value, 2), _ = _d[0], component = _d[1];
	                if (component.hasTagLabel(label)) {
	                    result.push(component);
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
	        return result;
	    };
	    // 找到所有含目标组件唯一标签一致的组件。只要有任意1个标签符合就行。此处规定名称一致的tag，unique也必须是一致的。且不可修改
	    ComponentManager.prototype.checkedComponentsWithTargetTags = function (component) {
	        var result = new Set();
	        var arr;
	        for (var i = component.tags.length - 1; i > -1; i--) {
	            if (component.tags[i].unique) {
	                arr = this.getComponentsByTagLabel(component.tags[i].label);
	                if (arr.length) {
	                    for (var j = arr.length - 1; j > -1; j--) {
	                        result.add(arr[j]);
	                    }
	                }
	            }
	        }
	        return result;
	    };
	    return ComponentManager;
	}(Manager));

	var TreeNodeWithEvent = EventFirer.mixin(tree.TreeNode);

	var arr$1;
	var Entity = /** @class */ (function (_super) {
	    __extends(Entity, _super);
	    function Entity(name, componentManager) {
	        if (name === void 0) { name = ""; }
	        var _this = _super.call(this) || this;
	        _this.id = IdGeneratorInstance.next();
	        _this.isEntity = true;
	        _this.componentManager = null;
	        _this.disabled = false;
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
	    Entity.prototype.addChild = function (entity) {
	        var e_1, _a;
	        _super.prototype.addChild.call(this, entity);
	        if (this.usedBy) {
	            try {
	                for (var _b = __values(this.usedBy), _c = _b.next(); !_c.done; _c = _b.next()) {
	                    var manager = _c.value;
	                    manager.add(entity);
	                }
	            }
	            catch (e_1_1) { e_1 = { error: e_1_1 }; }
	            finally {
	                try {
	                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
	                }
	                finally { if (e_1) throw e_1.error; }
	            }
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
	    Entity.prototype.destroy = function () {
	        var e_2, _a;
	        try {
	            for (var _b = __values(this.usedBy), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var manager = _c.value;
	                manager.remove(this);
	            }
	        }
	        catch (e_2_1) { e_2 = { error: e_2_1 }; }
	        finally {
	            try {
	                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
	            }
	            finally { if (e_2) throw e_2.error; }
	        }
	        this.unregisterComponentManager();
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
	    Entity.prototype.removeChild = function (entity) {
	        var e_3, _a;
	        _super.prototype.removeChild.call(this, entity);
	        if (this.usedBy) {
	            try {
	                for (var _b = __values(this.usedBy), _c = _b.next(); !_c.done; _c = _b.next()) {
	                    var manager = _c.value;
	                    manager.remove(entity);
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
	    Entity.prototype.removeComponent = function (component) {
	        if (this.componentManager) {
	            this.componentManager.remove(component);
	        }
	        return this;
	    };
	    Entity.prototype.serialize = function () {
	        return {};
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
	    EntityManager.prototype.createEntity = function (name) {
	        var entity = new Entity(name);
	        this.add(entity);
	        return entity;
	    };
	    EntityManager.prototype.addElementDirectly = function (entity) {
	        var e_1, _a;
	        _super.prototype.addElementDirectly.call(this, entity);
	        this.updatedEntities.add(entity);
	        try {
	            for (var _b = __values(entity.children), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var child = _c.value;
	                if (child) {
	                    this.add(child);
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
	    EntityManager.prototype.removeInstanceDirectly = function (entity) {
	        var e_2, _a;
	        _super.prototype.removeInstanceDirectly.call(this, entity);
	        this.deleteEntityFromSystemSet(entity);
	        try {
	            for (var _b = __values(entity.children), _c = _b.next(); !_c.done; _c = _b.next()) {
	                var child = _c.value;
	                if (child) {
	                    this.remove(child);
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
	    EntityManager.prototype.deleteEntityFromSystemSet = function (entity) {
	        var e_3, _a;
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
	        catch (e_3_1) { e_3 = { error: e_3_1 }; }
	        finally {
	            try {
	                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
	            }
	            finally { if (e_3) throw e_3.error; }
	        }
	    };
	    return EntityManager;
	}(Manager));

	var systemTmp;
	var SystemEvent = {
	    ADD: "add",
	    AFTER_RUN: "afterRun",
	    BEFORE_RUN: "beforeRun",
	    REMOVE: "remove"
	};
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
	        _super.prototype.add.call(this, system);
	        this.updateSystemEntitySetByAddFromManager(system);
	        return this;
	    };
	    SystemManager.prototype.clear = function () {
	        this.elements.clear();
	        return this;
	    };
	    SystemManager.prototype.remove = function (element) {
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
	    };
	    SystemManager.prototype.run = function (world) {
	        this.fire(SystemManager.Events.BEFORE_RUN, this);
	        this.elements.forEach(function (item) {
	            item.checkUpdatedEntities(world.entityManager);
	            if (!item.disabled) {
	                item.run(world);
	            }
	        });
	        if (world.entityManager) {
	            world.entityManager.updatedEntities.clear();
	        }
	        this.loopTimes++;
	        this.fire(SystemManager.Events.BEFORE_RUN, this);
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
	    SystemManager.Events = SystemEvent;
	    return SystemManager;
	}(Manager));

	var arr;
	var World = /** @class */ (function () {
	    function World(name, entityManager, systemManager) {
	        if (name === void 0) { name = ""; }
	        this.disabled = false;
	        this.entityManager = null;
	        this.systemManager = null;
	        this.store = new Map();
	        this.usedBy = [];
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
	    World.prototype.run = function () {
	        if (this.disabled) {
	            return this;
	        }
	        if (this.systemManager) {
	            this.systemManager.run(this);
	        }
	        return this;
	    };
	    World.prototype.serialize = function () {
	        return {
	            id: this.id,
	            name: this.name,
	            type: "world"
	        };
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

	exports.Component = Component;
	exports.ComponentManager = ComponentManager;
	exports.Entity = Entity;
	exports.Entitymanager = EntityManager;
	exports.IdGeneratorInstance = IdGeneratorInstance;
	exports.Manager = Manager;
	exports.PureSystem = PureSystem;
	exports.System = System;
	exports.SystemManager = SystemManager;
	exports.World = World;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=x.legacy.js.map
