import IManager from "./IManager";
import ISystem from "./ISystem";
import IWorld from "./IWorld";

export default interface ISystemManager extends IManager<ISystem> {
	disabled: boolean;
	loopTimes: number;
	usedBy: IWorld[];

	run(world: IWorld): this;
}
