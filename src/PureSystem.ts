import IEntity from "./interfaces/IEntity";
import System from "./System";

type TQueryRule = (entity: IEntity) => boolean;

export default class PureSystem extends System {
	private handler: Function;
	public constructor(name = "", fitRule: TQueryRule, handler: Function) {
		super(name, fitRule);
		this.handler = handler;
	}

	public handle(entity: IEntity, time: number, delta: number): this {
		this.handler(entity, time, delta);

		return this;
	}
}
