import IComponent from "./interfaces/IComponent";
export default class Component<T> implements IComponent<T> {
    readonly isComponent = true;
    data: T | null;
    disabled: boolean;
    name: string;
    usedBy: never[];
    dirty: boolean;
    constructor(name: string, data?: T | null);
    clone(): IComponent<T>;
}
