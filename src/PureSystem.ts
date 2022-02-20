import IEntity from "./interfaces/IEntity";
import System from "./System";
import { TWorldInjection } from "./interfaces/IWorld";

type TQueryRule = (entity: IEntity) => boolean;

export default class PureSystem extends System {
	private handler: Function;
	public constructor(name = "", fitRule: TQueryRule, handler: Function) {
		super(name, fitRule);
		this.handler = handler;
	}

	public handle(entity: IEntity, params: TWorldInjection): this {
		this.handler(entity, params);

		return this;
	}
}
