import { IECSObject } from "../interfaces/IECSObject";
export declare const add: <T extends IECSObject<U>, U>(element: T, map: Map<number, T>, owner: U) => boolean;
export declare const clear: <T extends IECSObject<U>, U>(map: Map<number, T>, owner: U) => U;
export declare const get: <T extends IECSObject<U>, U>(map: Map<number, T>, name: string | number | (new (...args: any[]) => any)) => T;
export declare const has: <T extends IECSObject<U>, U>(map: Map<number, T>, element: string | number | T | (new (...args: any) => any)) => boolean;
export declare const remove: <T extends IECSObject<U>, U>(map: Map<number, T>, element: string | number | T | (new (...args: any[]) => T), owner: U) => boolean;
