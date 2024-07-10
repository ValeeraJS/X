import { TreeNode } from "@valeera/tree";
import { Component, ComponentConstructor } from "./Component";
import { World } from "./World";
import { IECSObject } from "./interfaces/IECSObject";
export type EntityConstructor = new (...args: any[]) => Entity;
export declare class Entity extends TreeNode implements IECSObject<World> {
    readonly id: number;
    readonly isEntity = true;
    readonly components: Map<number, Component<any>>;
    disabled: boolean;
    name: string;
    usedBy: World[];
    children: Entity[];
    constructor(name?: string);
    add(componentOrChild: Component<any> | Entity): this;
    addComponent(component: Component<any>): this;
    addChild(entity: Entity): this;
    clone(cloneComponents?: boolean, includeChildren?: boolean): Entity;
    destroy(): this;
    getComponent<T>(nameOrId: string | number | ComponentConstructor<T>): Component<T> | null;
    hasComponent(component: Component<any> | string | number | ComponentConstructor<any>): boolean;
    remove(entityOrComponent: Entity | Component<any> | ComponentConstructor<any>): this;
    removeChild(entity: Entity): this;
    removeComponent(component: Component<any> | string | ComponentConstructor<any>): this;
}
