export default interface IECSObject {
	readonly id: number;
	disabled: boolean;
	name: string;
	usedBy: any[];
}
