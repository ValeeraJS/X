export default interface IManager<T> {
    elements: Map<string, T>;
    usedBy: any[];
    addElement: (element: T) => this;
    clear: () => this;
    get: (name: string) => T | null;
    has: (element: T | string) => boolean;
    removeElement: (element: T | string) => this;
}
