import IEntity from "./interfaces/IEntity";
import System from "./System";
type TQueryRule = (entity: IEntity) => boolean;
export default class PureSystem extends System {
    private handler;
    constructor(name: string | undefined, fitRule: TQueryRule, handler: Function);
    handle(entity: IEntity, time: number, delta: number): this;
}
export {};
