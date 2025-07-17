import IdGenerator from '@valeera/idgenerator';
import { TreeNode } from '@valeera/tree';

const IdGeneratorInstance = new IdGenerator();

class System {
    id = IdGeneratorInstance.next();
    isSystem = true;
    name = "";
    loopTimes = 0;
    entitySet = new WeakMap();
    usedBy = [];
    autoUpdate = true;
    handler;
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
            this.usedBy[i].updateOrder();
        }
    }
    constructor(rule, handler, name) {
        this.name = name ?? this.constructor.name;
        this.disabled = false;
        this.handler = handler ?? (() => { });
        this.rule = rule;
    }
    checkEntityManager(world) {
        let weakMapTmp = this.entitySet.get(world);
        if (!weakMapTmp) {
            weakMapTmp = new Set();
            this.entitySet.set(world, weakMapTmp);
        }
        else {
            weakMapTmp.clear();
        }
        world.entities.forEach((item) => {
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
    update(world, time, delta) {
        if (this.disabled) {
            return this;
        }
        this.entitySet.get(world)?.forEach((item) => {
            this.handle(item, time, delta, world);
        });
        return this;
    }
    destroy() {
        for (let i = this.usedBy.length - 1; i > -1; i--) {
            this.usedBy[i].remove(this);
        }
        return this;
    }
    handle(entity, time, delta, world) {
        this.handler(entity, time, delta, world);
        return this;
    }
}

class Component {
    isComponent = true;
    id = IdGeneratorInstance.next();
    data = null;
    disabled = false;
    name;
    usedBy = [];
    constructor(data = null, name = "Untitled Component") {
        this.name = name;
        this.data = data;
    }
    clone() {
        return new Component(structuredClone(this.data), this.name);
    }
    destroy() {
        this.usedBy.forEach((manager) => {
            manager.remove(this);
        });
        this.data = null;
    }
}

const unsortedRemove = (arr, i) => {
    if (i >= arr.length || i < 0) {
        return;
    }
    const last = arr.pop();
    if (i < arr.length) {
        const tmp = arr[i];
        arr[i] = last;
        return tmp;
    }
    return last;
};

const add = (element, map, owner) => {
    if (has(map, element)) {
        return false;
    }
    map.set(element.id, element);
    element.usedBy.push(owner);
    return true;
};
const clear = (map, owner) => {
    const arr = Array.from(map);
    for (let element of arr) {
        remove(map, element[1], owner);
    }
    return owner;
};
const get = (map, name) => {
    if (typeof name === "number") {
        return map.get(name) ?? null;
    }
    if (typeof name === "function") {
        for (const [, item] of map) {
            if (item instanceof name) {
                return item;
            }
        }
    }
    for (const [, item] of map) {
        if (item.name === name) {
            return item;
        }
    }
    return null;
};
const has = (map, element) => {
    if (typeof element === "number") {
        return map.has(element);
    }
    else if (typeof element === "string") {
        for (const [, item] of map) {
            if (item.name === element) {
                return true;
            }
        }
        return false;
    }
    else if (typeof element === "function") {
        for (const [, item] of map) {
            if (item.constructor === element) {
                return true;
            }
        }
        return false;
    }
    else {
        return map.has(element.id);
    }
};
const remove = (map, element, owner) => {
    let elementTmp;
    if (typeof element === "number" || typeof element === "string") {
        elementTmp = get(map, element);
    }
    else if (typeof element === "function") {
        for (let item of map) {
            if (item[1].constructor === element) {
                elementTmp = item[1];
                break;
            }
        }
    }
    else {
        for (let item of map) {
            if (item[1] === element) {
                elementTmp = item[1];
                break;
            }
        }
    }
    if (elementTmp) {
        map.delete(elementTmp.id);
        unsortedRemove(elementTmp.usedBy, elementTmp.usedBy.indexOf(owner));
        return true;
    }
    return false;
};

const EntitiesCache = new WeakMap();
const SystemOrderCache = new WeakMap();

class Entity extends TreeNode {
    static tagSet = new Map();
    static setTag(name, components) {
        const set = new Set();
        Entity.tagSet.set(name, set);
        components.forEach((val) => {
            if (val instanceof Object) {
                set.add(val);
            }
            else {
                Entity.tagSet.get(val)?.forEach((ele) => {
                    set.add(ele);
                });
            }
        });
    }
    static removeTag(name) {
        Entity.tagSet.delete(name);
    }
    id = IdGeneratorInstance.next();
    isEntity = true;
    components = new Map();
    disabled = false;
    name;
    usedBy = [];
    children = [];
    constructor(name = "Untitled Entity") {
        super();
        this.name = name;
    }
    add(componentOrChild, ...args) {
        if (componentOrChild instanceof Entity) {
            return this.addChild(componentOrChild);
        }
        if (componentOrChild instanceof Component) {
            return this.addComponent(componentOrChild);
        }
        return this.add(new componentOrChild(...args));
    }
    addComponent(component, ...args) {
        if (component instanceof Component) {
            add(component, this.components, this);
        }
        else {
            add(new component(...args), this.components, this);
        }
        for (let i = 0, len = this.usedBy.length; i < len; i++) {
            EntitiesCache.get(this.usedBy[i]).add(this);
        }
        return this;
    }
    addChild(entity, ...args) {
        const e = entity instanceof Entity ? entity : new entity(...args);
        for (const world of this.usedBy) {
            world.add(e);
        }
        return super.addChild(e);
    }
    clone(cloneComponents, includeChildren) {
        const entity = new this.constructor(this.name);
        if (cloneComponents) {
            this.components.forEach((component) => {
                entity.addComponent(component.clone());
            });
        }
        else {
            this.components.forEach((component) => {
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
        this.components.forEach((c) => {
            c.destroy();
        });
        return clear(this.components, this);
    }
    fitTag(tag) {
        const compClass = Entity.tagSet.get(tag);
        if (!compClass) {
            return;
        }
        compClass.forEach((val) => {
            if (!this.hasComponent(val)) {
                this.add(val);
            }
        });
        return this;
    }
    getComponent(nameOrId) {
        return get(this.components, nameOrId);
    }
    hasComponent(component) {
        return has(this.components, component);
    }
    isFitTag(name) {
        const tags = Entity.tagSet.get(name);
        if (!tags) {
            return false;
        }
        for (const item of tags) {
            if (!this.hasComponent(item)) {
                return false;
            }
        }
        return true;
    }
    remove(entityOrComponent) {
        if (entityOrComponent instanceof Entity) {
            return this.removeChild(entityOrComponent);
        }
        return this.removeComponent(entityOrComponent);
    }
    removeChild(entity) {
        for (const world of this.usedBy) {
            world.removeEntity(entity);
        }
        return super.removeChild(entity);
    }
    removeComponent(component) {
        if (remove(this.components, component, this)) {
            for (let i = 0, len = this.usedBy.length; i < len; i++) {
                EntitiesCache.get(this.usedBy[i]).add(this);
            }
        }
        return this;
    }
}
function componentAccessor(key) {
    return function (entityConstructor) {
        const update = (entity) => {
            let value = entity[key];
            const getter = function () {
                return value;
            };
            const setter = function (newVal) {
                const old = entity[key];
                if (old) {
                    entity.removeComponent(old);
                }
                value = newVal;
                if (value) {
                    entity.addComponent(newVal);
                }
            };
            Reflect.defineProperty(entity, key, {
                configurable: true,
                get: getter,
                set: setter
            });
            entity[key] = value;
        };
        return function () {
            const origin = new entityConstructor();
            update(origin);
            return origin;
        };
    };
}

const sort = (a, b) => a.priority - b.priority;
class World {
    disabled = false;
    name;
    entities = new Map();
    systems = new Map();
    id = IdGeneratorInstance.next();
    isWorld = true;
    constructor(name) {
        this.name = name ?? this.constructor.name;
        EntitiesCache.set(this, new Set());
        SystemOrderCache.set(this, []);
    }
    get rootEntities() {
        const result = [];
        this.entities.forEach((entity) => {
            if (!entity.parent) {
                result.push(entity);
            }
        });
        return result;
    }
    add(element, ...args) {
        if (element instanceof Entity) {
            return this.addEntity(element);
        }
        else if (element instanceof System) {
            return this.addSystem(element);
        }
        return this.add(new element(...args));
    }
    addEntity(entity, ...args) {
        const e = entity instanceof Entity ? entity : new entity(...args);
        add(e, this.entities, this);
        EntitiesCache.get(this).add(e);
        for (const child of e.children) {
            this.add(child);
        }
        return this;
    }
    addSystem(system, ...args) {
        const s = system instanceof System ? system : new system(...args);
        add(s, this.systems, this);
        s.checkEntityManager(this);
        return this.updateOrder();
    }
    clear() {
        return this.clearSystems().clearEntities();
    }
    clearEntities() {
        clear(this.entities, this);
        return this;
    }
    clearSystems() {
        clear(this.systems, this);
        return this;
    }
    createEntity(name) {
        const entity = new Entity(name);
        this.addEntity(entity);
        return entity;
    }
    destroy() {
        const arr1 = Array.from(this.systems);
        for (let item of arr1) {
            if (item[1].usedBy.length === 1) {
                item[1].destroy();
            }
            else {
                this.removeSystem(item[1]);
            }
        }
        const arr2 = this.rootEntities;
        for (let item of arr2) {
            if (item.usedBy.length === 1) {
                item.destroy();
            }
            else {
                this.removeEntity(item);
            }
        }
        this.disabled = true;
        return this;
    }
    getEntity(entity) {
        return get(this.entities, entity);
    }
    getSystem(system) {
        return get(this.systems, system);
    }
    hasEntity(entity) {
        return has(this.entities, entity);
    }
    hasSystem(system) {
        return has(this.systems, system);
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
        if (typeof entity === "number" || typeof entity === "string" || typeof entity === "function") {
            entity = get(this.entities, entity);
        }
        if (!entity) {
            return this;
        }
        unsortedRemove(entity.usedBy, entity.usedBy.indexOf(this));
        remove(this.entities, entity, this);
        this.systems.forEach((system) => {
            system.entitySet.get(this).delete(entity);
        });
        for (const child of entity.children) {
            this.remove(child);
        }
        return this;
    }
    removeSystem(system) {
        let systemTmp;
        if (typeof system === "number" || typeof system === "string") {
            systemTmp = get(this.systems, system);
        }
        else if (system instanceof System) {
            if (this.systems.has(system.id)) {
                systemTmp = system;
            }
        }
        else {
            for (let item of this.systems) {
                if (item[1].constructor === system) {
                    systemTmp = item[1];
                    break;
                }
            }
        }
        if (systemTmp) {
            systemTmp.entitySet.delete(this);
            unsortedRemove(systemTmp.usedBy, systemTmp.usedBy.indexOf(this));
            remove(this.systems, systemTmp, this);
        }
        return this.updateOrder();
    }
    update(time = performance.now(), delta = 0) {
        if (this.disabled) {
            return this;
        }
        SystemOrderCache.get(this).forEach((system) => {
            const weakMapTmp = system.entitySet.get(this);
            EntitiesCache.get(this).forEach((item) => {
                if (system.query(item)) {
                    weakMapTmp.add(item);
                }
                else {
                    weakMapTmp.delete(item);
                }
            });
            if (system.autoUpdate) {
                system.update(this, time, delta);
            }
        });
        EntitiesCache.get(this).clear();
        return this;
    }
    updateOrder() {
        const arr = [];
        this.systems.forEach((element) => {
            arr.push(element);
        });
        arr.sort(sort);
        SystemOrderCache.set(this, arr);
        return this;
    }
}

export { Component, Entity, System, World, componentAccessor, unsortedRemove };
