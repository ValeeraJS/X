export default interface IManager<T> {
	elements: Map<number, T>;
	usedBy: any[];

	addElement: (element: T) => this;
	clear: () => this;
	get: (name: string | number) => T | null;
	has: (element: T | string | number) => boolean;
	removeElement: (element: T | string | number) => this;
}
