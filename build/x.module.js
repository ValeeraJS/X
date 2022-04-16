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
    constructor(name, data) {
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
    addElement(element) {
        if (this.has(element)) {
            this.removeElementByInstance(element);
        }
        return this.addElementDirect(element);
    }
    addElementDirect(element) {
        this.elements.set(element.name, element);
        element.usedBy.push(this);
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
    has(element) {
        if (typeof element === "string") {
            return this.elements.has(element);
        }
        else {
            return this.elements.has(element.name);
        }
    }
    removeElement(element) {
        return typeof element === "string"
            ? this.removeElementByName(element)
            : this.removeElementByInstance(element);
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
    removeElementByInstance(element) {
        if (this.elements.has(element.name)) {
            this.elements.delete(element.name);
            element.usedBy.splice(element.usedBy.indexOf(this), 1);
            this.elementChangeDispatch(Manager.Events.REMOVE, this);
        }
        return this;
    }
    elementChangeDispatch(type, eventObject) {
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

// import { IdGeneratorInstance } from "./Global";
// 私有全局变量，外部无法访问
// let componentTmp: IComponent<any> | undefined;
var EComponentEvent;
(function (EComponentEvent) {
    EComponentEvent["ADD_COMPONENT"] = "addComponent";
    EComponentEvent["REMOVE_COMPONENT"] = "removeComponent";
})(EComponentEvent || (EComponentEvent = {}));
class ComponentManager extends Manager {
    isComponentManager = true;
    usedBy = [];
}

const TreeNodeWithEvent = mixin(TreeNode);

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
    addChild(entity) {
        super.addChild(entity);
        if (this.usedBy) {
            for (const manager of this.usedBy) {
                manager.addElement(entity);
            }
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
    removeChild(entity) {
        super.removeChild(entity);
        if (this.usedBy) {
            for (const manager of this.usedBy) {
                manager.removeElement(entity);
            }
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
    addElementDirect(entity) {
        super.addElementDirect(entity);
        this.updatedEntities.add(entity);
        for (const child of entity.children) {
            if (child) {
                this.addElement(child);
            }
        }
        return this;
    }
    createEntity(name) {
        const entity = new Entity(name);
        this.addElement(entity);
        return entity;
    }
    removeElementByName(name) {
        entityTmp = this.elements.get(name);
        if (entityTmp) {
            super.removeElementByName(name);
            this.deleteEntityFromSystemSet(entityTmp);
            for (const child of entityTmp?.children) {
                if (child) {
                    this.removeElementByInstance(child);
                }
            }
        }
        return this;
    }
    removeElementByInstance(entity) {
        if (this.elements.has(entity.name)) {
            super.removeElementByInstance(entity);
            this.deleteEntityFromSystemSet(entity);
            for (const child of entity.children) {
                if (child) {
                    this.removeElementByInstance(child);
                }
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
        super.addElement(system);
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

export { Component, ComponentManager, Entity, EntityManager as Entitymanager, IdGeneratorInstance, Manager, PureSystem, System, SystemManager, World };
