import IdGenerator from '@valeera/idgenerator';
import EventFirer, { mixin } from '@valeera/eventdispatcher';
import { TreeNode } from '@valeera/tree';

const IdGeneratorInstance = new IdGenerator();

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
    _disabled = false;
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
        if (this.disabled) {
            return this;
        }
        if (world.entityManager) {
            this.entitySet.get(world.entityManager)?.forEach((item) => {
                if (!item.disabled) {
                    this.handle(item, world.store);
                }
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
}

class PureSystem extends System {
    handler;
    constructor(name = "", fitRule, handler) {
        super(name, fitRule);
        this.handler = handler;
    }
    handle(entity, params) {
        this.handler(entity, params);
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
    dirty = false;
    tags;
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
            type: "component"
        };
    }
}

// 私有全局变量，外部无法访问
let elementTmp;
const ElementChangeEvent = {
    ADD: "add",
    REMOVE: "remove"
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, item] of this.elements) {
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

// 私有全局变量，外部无法访问
// let componentTmp: IComponent<any> | undefined;
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
            this.removeInstanceDirectly(item);
        }
        return this.addElementDirectly(element);
    }
    getComponentsByTagLabel(label) {
        const result = [];
        for (const [_, component] of this.elements) {
            if (component.hasTagLabel(label)) {
                result.push(component);
            }
        }
        return result;
    }
    getFirstComponentByTagLabel(label) {
        for (const [_, component] of this.elements) {
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

const TreeNodeWithEvent = mixin(TreeNode);

let arr$1;
class Entity extends TreeNodeWithEvent {
    id = IdGeneratorInstance.next();
    isEntity = true;
    componentManager = null;
    disabled = false;
    name = "";
    usedBy = [];
    constructor(name = "", componentManager) {
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
    getFirstComponentByTagLabel(label) {
        return this.componentManager?.getFirstComponentByTagLabel(label) || null;
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
    REMOVE: "remove"
};
class SystemManager extends Manager {
    static Events = SystemEvent;
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
    add(system) {
        super.add(system);
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
    run(world) {
        this.fire(SystemManager.Events.BEFORE_RUN, this);
        this.elements.forEach((item) => {
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
    disabled = false;
    name;
    entityManager = null;
    systemManager = null;
    store = new Map();
    usedBy = [];
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
    run() {
        if (this.disabled) {
            return this;
        }
        if (this.systemManager) {
            this.systemManager.run(this);
        }
        return this;
    }
    serialize() {
        return {
            id: this.id,
            name: this.name,
            type: "world"
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

export { Component, ComponentManager, Entity, EntityManager as Entitymanager, IdGeneratorInstance, Manager, PureSystem, System, SystemManager, World };
