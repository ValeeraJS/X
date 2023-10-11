import { IEntity } from "./interfaces/IEntity";
import { System } from "./System";
type TQueryRule = (entity: IEntity) => boolean;
export declare class PureSystem extends System {
    private handler;
    constructor(fitRule: TQueryRule, handler: Function, name?: string);
    handle(entity: IEntity, time: number, delta: number): this;
}
export {};
