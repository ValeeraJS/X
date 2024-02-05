import { EventFirer, mixin } from '@valeera/eventfire';
import IdGenerator from '@valeera/idgenerator';
import { TreeNode } from '@valeera/tree';

const IdGeneratorInstance = new IdGenerator();

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
    #handler;
    #handlerBefore;
    #handlerAfter;
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
    constructor(fitRule, handler, handlerBefore, handlerAfter, name) {
        super();
        this.name = name ?? this.constructor.name;
        this.disabled = false;
        this.#handler = handler;
        this.#handlerAfter = handlerAfter;
        this.#handlerBefore = handlerBefore;
        this.rule = fitRule;
    }
    checkEntityManager(manager) {
        let weakMapTmp = this.entitySet.get(manager);
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
        this.entitySet.get(world.entityManager)?.forEach((item) => {
            // 此处不应该校验disabled。这个交给各自系统自行判断
            this.handle(item, time, delta, world);
        });
        this.handleAfter?.(time, delta, world);
        return this;
    }
    serialize() {
        return {
            id: this.id,
            name: this.name,
            autoUpdate: this.autoUpdate,
            priority: this.priority,
            disabled: this.disabled,
            class: this.constructor.name,
        };
    }
    destroy() {
        for (let i = this.usedBy.length - 1; i > -1; i--) {
            this.usedBy[i].remove(this);
        }
        return this;
    }
    handle(entity, time, delta, world) {
        this.#handler(entity, time, delta, world);
        return this;
    }
    handleAfter(time, delta, world) {
        this.#handlerAfter?.(time, delta, world);
        return this;
    }
    handleBefore(time, delta, world) {
        this.currentTime = time;
        this.currentDelta = delta;
        this.currentWorld = world;
        this.loopTimes++;
        this.#handlerBefore?.(time, delta, world);
        return this;
    }
}

class Component extends EventFirer {
    static unserialize(json) {
        const component = new Component(json.data, json.tags, json.name);
        component.disabled = json.disabled;
        return component;
    }
    isComponent = true;
    id = IdGeneratorInstance.next();
    data = null;
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
    constructor(data = null, tags = [], name = "Untitled Component") {
        super();
        this.name = name;
        this.data = data;
        this.tags = tags;
    }
    clone() {
        return new Component(structuredClone(this.data), this.tags, this.name);
    }
    destroy() {
        this.usedBy.forEach((manager) => {
            manager.usedBy.remove(this);
        });
        this.data = null;
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
            class: "Component",
            data: this.data,
            disabled: this.disabled,
            id: this.id,
            name: this.name,
            tags: this.tags,
        };
    }
}

const CommonECSObjectEvents = {
    ADDED: "added",
    REMOVED: "removed",
    UPDATED: "updated",
    CREATED: "created",
    BEFORE_DESTROY: "before-destroy",
};
const EntityEvents = {
    ADD_CHILD: "add-child",
    ADD_COMPONENT: "add-component",
    REMOVE_CHILD: "remove-child",
    REMOVE_COMPONENT: "remove-component",
};

// 私有全局变量，外部无法访问
let elementTmp;
class Manager extends EventFirer {
    elements = new Map();
    disabled = false;
    usedBy;
    isManager = true;
    constructor(usedBy) {
        super();
        this.usedBy = usedBy;
    }
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
            return this.elements.get(name) ?? null;
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
            for (const [, item] of this.elements) {
                if (item.name === element) {
                    return true;
                }
            }
            return false;
        }
        else if (typeof element === "function" && element.prototype) {
            for (const [, item] of this.elements) {
                if (item.constructor === element) {
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
                this.removeElementDirectly(elementTmp);
            }
        }
        else if (typeof element === "function") {
            this.elements.forEach((item) => {
                if (item.constructor === element) {
                    this.removeElementDirectly(item);
                }
            });
        }
        else {
            this.elements.forEach((item) => {
                if (item === element) {
                    this.removeElementDirectly(element);
                }
            });
        }
        return this;
    }
    addElementDirectly(element) {
        this.elements.set(element.id, element);
        element.usedBy.push(this);
        return this;
    }
    // 必定有element情况
    removeElementDirectly(element) {
        this.elements.delete(element.id);
        element.usedBy.splice(element.usedBy.indexOf(this), 1);
        return this;
    }
}

var EComponentEvent;
(function (EComponentEvent) {
    EComponentEvent["ADD_COMPONENT"] = "addComponent";
    EComponentEvent["REMOVE_COMPONENT"] = "removeComponent";
})(EComponentEvent || (EComponentEvent = {}));
class ComponentManager extends Manager {
    isComponentManager = true;
    add(element) {
        if (this.has(element)) {
            return this;
        }
        const componentSet = this.checkedComponentsWithTargetTags(element);
        for (const item of componentSet) {
            this.removeElementDirectly(item);
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
    addElementDirectly(element) {
        super.addElementDirectly(element);
        element.fire(CommonECSObjectEvents.ADDED, element);
        this.usedBy.fire(EntityEvents.ADD_COMPONENT, this);
        for (let i = 0, len = this.usedBy.usedBy.length; i < len; i++) {
            this.usedBy.usedBy[i].updatedEntities.add(this.usedBy);
        }
        return this;
    }
    // 必定有element情况
    removeElementDirectly(element) {
        super.removeElementDirectly(element);
        element.fire(CommonECSObjectEvents.REMOVED, element);
        this.usedBy.fire(EntityEvents.REMOVE_COMPONENT, this);
        for (let i = 0, len = this.usedBy.usedBy.length; i < len; i++) {
            this.usedBy.usedBy[i].updatedEntities.add(this.usedBy);
        }
        return this;
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

class EntityManager extends Manager {
    data = null;
    updatedEntities = new Set();
    isEntityManager = true;
    createEntity(name) {
        const entity = new Entity(name);
        this.add(entity);
        return entity;
    }
    addElementDirectly(entity) {
        super.addElementDirectly(entity);
        this.updatedEntities.add(entity);
        for (const child of entity.children) {
            this.add(child);
        }
        return this;
    }
    removeElementDirectly(entity) {
        super.removeElementDirectly(entity);
        this.deleteEntityFromSystemSet(entity);
        for (const child of entity.children) {
            this.remove(child);
        }
        return this;
    }
    deleteEntityFromSystemSet(entity) {
        entity.usedBy.splice(entity.usedBy.indexOf(this), 1);
        const world = this.usedBy;
        world.systemManager.elements.forEach((system) => {
            system.entitySet.get(this)?.delete(entity);
        });
    }
}

const SystemEvent = {
    ADD: "add",
    AFTER_RUN: "afterRun",
    BEFORE_RUN: "beforeRun",
    REMOVE: "remove",
    ADDED: "added",
    REMOVED: "removed",
};
const sort = (a, b) => a[1].priority - b[1].priority;
class SystemManager extends Manager {
    static Events = SystemEvent;
    disabled = false;
    elements = new Map();
    loopTimes = 0;
    #systemChunks = [];
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
            const systemTmp = this.get(element);
            if (systemTmp) {
                this.removeElementDirectly(systemTmp);
                this.updateSystemEntitySetByRemovedFromManager(systemTmp);
                systemTmp.usedBy.splice(systemTmp.usedBy.indexOf(this), 1);
            }
        }
        else if (element instanceof System) {
            if (this.elements.has(element.id)) {
                this.removeElementDirectly(element);
                this.updateSystemEntitySetByRemovedFromManager(element);
                element.usedBy.splice(element.usedBy.indexOf(this), 1);
            }
        }
        else {
            this.elements.forEach((system) => {
                if (system instanceof element) {
                    this.removeElementDirectly(system);
                    this.updateSystemEntitySetByRemovedFromManager(system);
                    system.usedBy.splice(system.usedBy.indexOf(this), 1);
                }
            });
        }
        return this;
    }
    run(world, time, delta) {
        this.fire(SystemManager.Events.BEFORE_RUN, this);
        this.elements.forEach((item) => {
            this.checkUpdatedEntities(item, world.entityManager);
            if (!item.disabled && item.autoUpdate) {
                item.run(world, time, delta);
            }
        });
        world.entityManager.updatedEntities.clear();
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
    checkUpdatedEntities(system, manager) {
        let weakMapTmp = system.entitySet.get(manager);
        manager.updatedEntities.forEach((item) => {
            if (system.query(item)) {
                weakMapTmp.add(item);
            }
            else {
                weakMapTmp.delete(item);
            }
        });
        return this;
    }
    updateSystemEntitySetByRemovedFromManager(system) {
        system.entitySet.delete(this.usedBy.entityManager);
        return this;
    }
    updateSystemEntitySetByAddFromManager(system) {
        system.checkEntityManager(this.usedBy.entityManager);
        return this;
    }
}

class World extends EventFirer {
    disabled = false;
    name;
    entityManager = new EntityManager(this);
    systemManager = new SystemManager(this);
    usedBy = [];
    id = IdGeneratorInstance.next();
    isWorld = true;
    constructor(name) {
        super();
        this.name = name ?? this.constructor.name;
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
        this.entityManager.add(entity);
        return this;
    }
    addSystem(system) {
        this.systemManager.add(system);
        return this;
    }
    clearAllEntities() {
        this.entityManager.clear();
        return this;
    }
    clearAllSystems() {
        this.systemManager.clear();
        return this;
    }
    createEntity(name) {
        return this.entityManager.createEntity(name);
    }
    hasEntity(entity) {
        return this.entityManager.has(entity);
    }
    hasSystem(system) {
        return this.systemManager.has(system);
    }
    remove(element) {
        if (element instanceof System || typeof element === "function") {
            return this.removeSystem(element);
        }
        else {
            return this.removeEntity(element);
        }
    }
    removeEntity(entity) {
        this.entityManager.remove(entity);
        return this;
    }
    removeSystem(system) {
        this.systemManager.remove(system);
        return this;
    }
    run(time, delta) {
        if (this.disabled) {
            return this;
        }
        this.systemManager.run(this, time, delta);
        return this;
    }
    serialize() {
        return {
            id: this.id,
            name: this.name,
            type: "world",
            class: this.constructor.name,
            disabled: this.disabled,
            systems: [],
            entities: [],
        };
    }
}

class Entity extends mixin(TreeNode) {
    id = IdGeneratorInstance.next();
    isEntity = true;
    componentManager = new ComponentManager(this);
    disabled = false;
    name = "";
    usedBy = [];
    constructor(name = "Untitled Entity") {
        super();
        this.name = name;
    }
    add(componentOrChild) {
        if (componentOrChild instanceof Entity) {
            return this.addChild(componentOrChild);
        }
        return this.addComponent(componentOrChild);
    }
    addComponent(component) {
        this.componentManager.add(component);
        return this;
    }
    addChild(entity) {
        super.addChild(entity);
        for (const manager of this.usedBy) {
            manager.add(entity);
        }
        return this;
    }
    addTo(worldOrManager) {
        if (worldOrManager instanceof World) {
            return this.addToWorld(worldOrManager);
        }
        if (worldOrManager instanceof Entity) {
            worldOrManager.addChild(this);
            return this;
        }
        return this.addToManager(worldOrManager);
    }
    addToWorld(world) {
        world.entityManager.add(this);
        return this;
    }
    addToManager(manager) {
        manager.add(this);
        return this;
    }
    clone(cloneComponents, includeChildren) {
        const entity = new Entity(this.name);
        if (cloneComponents) {
            this.componentManager.elements.forEach((component) => {
                entity.addComponent(component.clone());
            });
        }
        else {
            this.componentManager.elements.forEach((component) => {
                entity.addComponent(component);
            });
        }
        if (includeChildren) {
            for (let i = 0, len = this.children.length; i < len; i++) {
                entity.addChild(this.children[i].clone());
            }
        }
        return entity;
    }
    destroy() {
        for (const manager of this.usedBy) {
            manager.remove(this);
        }
        this.componentManager.elements.forEach((c) => {
            c.destroy();
        });
        this.componentManager.clear();
        return this;
    }
    getComponent(nameOrId) {
        return this.componentManager.get(nameOrId);
    }
    getComponentsByTagLabel(label) {
        return this.componentManager.getComponentsByTagLabel(label);
    }
    getComponentByTagLabel(label) {
        return this.componentManager.getComponentByTagLabel(label);
    }
    getComponentsByClass(clazz) {
        return this.componentManager.getComponentsByClass(clazz);
    }
    hasComponent(component) {
        return this.componentManager.has(component);
    }
    remove(entityOrComponent) {
        if (entityOrComponent instanceof Entity) {
            return this.removeChild(entityOrComponent);
        }
        return this.removeComponent(entityOrComponent);
    }
    removeChild(entity) {
        super.removeChild(entity);
        for (const manager of this.usedBy) {
            manager.remove(entity);
        }
        return this;
    }
    removeComponent(component) {
        this.componentManager.remove(component);
        return this;
    }
    serialize() {
        const result = {
            id: this.id,
            name: this.name,
            disabled: this.disabled,
            class: "Entity",
            components: [],
        };
        this.componentManager.elements.forEach((c) => {
            result.components.push(c.id);
        });
        return result;
    }
}

export { Component, ComponentManager, EComponentEvent, Entity, EntityManager, Manager, System, SystemManager, World };
