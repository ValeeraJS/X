import IEntity from "./IEntity";

export default interface IWorld {
	name: string;
	entities: IEntity[];
	run: (time: number) => this;
}
