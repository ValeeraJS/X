import { IEntity } from "./interfaces/IEntity";
import { System } from "./System";

type TQueryRule = (entity: IEntity) => boolean;

export class PureSystem extends System {
	private handler: Function;
	public constructor(fitRule: TQueryRule, handler: Function, name = "Untitled PureSystem") {
		super(fitRule, name);
		this.handler = handler;
	}

	public handle(entity: IEntity, time: number, delta: number): this {
		this.handler(entity, time, delta);

		return this;
	}
}
