import IdGenerator from '@valeera/idgenerator';
import EventDispatcher from '@valeera/eventdispatcher';

const IdGeneratorInstance = new IdGenerator();

var Global = /*#__PURE__*/Object.freeze({
	__proto__: null,
	IdGeneratorInstance: IdGeneratorInstance
});

let weakMapTmp;
class AbstructSystem {
    constructor(name, fitRule) {
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
    query(entity) {
        return this.queryRule(entity);
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
    run(world, params) {
        params.world = world;
        if (world.entityManager) {
            this.entitySet.get(world.entityManager)?.forEach((item) => {
                this.handle(item, params);
            });
        }
        return this;
    }
}

class Component {
    constructor(name, data) {
        this.isComponent = true;
        this.data = null;
        this.disabled = false;
        this.usedBy = [];
        this.dirty = false;
        this.name = name;
        this.data = data;
    }
    clone() {
        return new Component(this.name, this.data);
    }
}

// 私有全局变量，外部无法访问
let componentTmp;
var EComponentEvent;
(function (EComponentEvent) {
    EComponentEvent["ADD_COMPONENT"] = "addComponent";
    EComponentEvent["REMOVE_COMPONENT"] = "removeComponent";
})(EComponentEvent || (EComponentEvent = {}));
class ComponentManager {
    constructor() {
        this.elements = new Map();
        this.disabled = false;
        this.usedBy = [];
        this.isComponentManager = true;
    }
    add(component) {
        if (this.has(component)) {
            this.removeByInstance(component);
        }
        return this.addComponentDirect(component);
    }
    addComponentDirect(component) {
        this.elements.set(component.name, component);
        component.usedBy.push(this);
        ComponentManager.eventObject = {
            component,
            eventKey: ComponentManager.ADD_COMPONENT,
            manager: this,
            target: component
        };
        this.entityComponentChangeDispatch(ComponentManager.ADD_COMPONENT, ComponentManager.eventObject);
        return this;
    }
    clear() {
        this.elements.clear();
        return this;
    }
    get(name) {
        componentTmp = this.elements.get(name);
        return componentTmp ? componentTmp : null;
    }
    has(component) {
        if (typeof component === "string") {
            return this.elements.has(component);
        }
        else {
            return this.elements.has(component.name);
        }
    }
    // TODO
    isMixedFrom(componentManager) {
        console.log(componentManager);
        return false;
    }
    // TODO
    mixFrom(componentManager) {
        console.log(componentManager);
        return this;
    }
    remove(component) {
        return typeof component === "string"
            ? this.removeByName(component)
            : this.removeByInstance(component);
    }
    removeByName(name) {
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
    }
    removeByInstance(component) {
        if (this.elements.has(component.name)) {
            this.elements.delete(component.name);
            component.usedBy.splice(component.usedBy.indexOf(this), 1);
            ComponentManager.eventObject = {
                component,
                eventKey: ComponentManager.REMOVE_COMPONENT,
                manager: this,
                target: component
            };
            this.entityComponentChangeDispatch(ComponentManager.REMOVE_COMPONENT, ComponentManager.eventObject);
        }
        return this;
    }
    entityComponentChangeDispatch(type, eventObject) {
        for (const entity of this.usedBy) {
            entity.fire(type, eventObject);
            for (const manager of entity.usedBy) {
                manager.updatedEntities.add(entity);
            }
        }
    }
}
ComponentManager.ADD_COMPONENT = EComponentEvent.ADD_COMPONENT;
ComponentManager.REMOVE_COMPONENT = EComponentEvent.REMOVE_COMPONENT;
ComponentManager.eventObject = {
    component: null,
    eventKey: null,
    manager: null,
    target: null
};

let arr$1;
class Entity extends EventDispatcher {
    constructor(name, componentManager) {
        super();
        this.id = IdGeneratorInstance.next();
        this.isEntity = true;
        this.name = "";
        this.usedBy = [];
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
            this.componentManager.remove(component);
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
    constructor(world) {
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
    add(entity) {
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
    remove(entity) {
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
class SystemManager extends EventDispatcher {
    constructor(world) {
        super();
        this.disabled = false;
        this.elements = new Map();
        this.loopTimes = 0;
        this.usedBy = [];
        if (world) {
            this.usedBy.push(world);
        }
    }
    add(system) {
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
    get(name) {
        systemTmp = this.elements.get(name);
        return systemTmp ? systemTmp : null;
    }
    has(element) {
        if (typeof element === "string") {
            return this.elements.has(element);
        }
        else {
            return this.elements.has(element.name);
        }
    }
    remove(system) {
        return typeof system === "string"
            ? this.removeByName(system)
            : this.removeByInstance(system);
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
    run(world, params) {
        SystemManager.eventObject.eventKey = SystemManager.BEFORE_RUN;
        SystemManager.eventObject.manager = this;
        this.fire(SystemManager.BEFORE_RUN, SystemManager.eventObject);
        this.elements.forEach((item) => {
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
SystemManager.AFTER_RUN = ESystemEvent.AFTER_RUN;
SystemManager.BEFORE_RUN = ESystemEvent.BEFORE_RUN;
SystemManager.eventObject = {
    eventKey: null,
    manager: null,
    target: null
};

let arr;
class World {
    constructor(name, entityManager, systemManager) {
        this.id = IdGeneratorInstance.next();
        this.isWorld = true;
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
    run(params) {
        if (this.systemManager) {
            this.systemManager.run(this, params);
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

export { AbstructSystem, Component, ComponentManager, Entity, EntityManager as Entitymanager, Global, SystemManager, World };
//# sourceMappingURL=x.module.js.map
