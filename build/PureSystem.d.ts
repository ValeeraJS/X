import IEntity from "./interfaces/IEntity";
import System from "./System";
import { TWorldInjection } from "./interfaces/IWorld";
type TQueryRule = (entity: IEntity) => boolean;
export default class PureSystem extends System {
    private handler;
    constructor(name: string | undefined, fitRule: TQueryRule, handler: Function);
    handle(entity: IEntity, params: TWorldInjection): this;
}
export {};
