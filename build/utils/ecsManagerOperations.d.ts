import { IECSObject } from "../interfaces/IECSObject";
export declare const add: <U, T extends IECSObject<U>>(element: T, map: Map<number, T>, owner: U) => boolean;
export declare const clear: <U, T extends IECSObject<U>>(map: Map<number, T>, owner: U) => U;
export declare const get: <U, T extends IECSObject<U>>(map: Map<number, T>, name: string | number | (new (...args: any[]) => T)) => T;
export declare const has: <U, T extends IECSObject<U>>(map: Map<number, T>, element: string | number | T | (new (...args: any) => T)) => boolean;
export declare const remove: <U, T extends IECSObject<U>>(map: Map<number, T>, element: string | number | T | (new (...args: any[]) => T), owner: U) => boolean;
