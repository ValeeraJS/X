import ISystem from "./interfaces/ISystem";
import IWorld from "./interfaces/IWorld";

export default class SystemManager {
	public systems: Map<string, ISystem> = new Map();
	public world: IWorld;

	public addSystem(system: ISystem): this {
		if (this.systems.has(system.name)) {
			return this;
		}
		this.systems.set(system.name, system);

		return this;
	}
}
