import IComponent from "./interfaces/IComponent";
export default class Component<T> implements IComponent<T> {
    readonly isComponent = true;
    data: any;
    disabled: boolean;
    name: string;
    usedBy: never[];
    constructor(name: string, data: any);
    clone(): Component<unknown>;
}
