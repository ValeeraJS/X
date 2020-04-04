export default interface IManager<T> {
    elements: Map<string, T>;

    add: (element: T) => this;
    clear: () => this;
	get: (name: string) => T | null;
    has: (element: T | string) => boolean;
    remove: (element: T | string) => this;
}