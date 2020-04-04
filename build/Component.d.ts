import IComponent from "./interfaces/IComponent";
export default class Component implements IComponent {
    readonly isComponent = true;
    data: any;
    disabled: boolean;
    name: string;
    usedBy: never[];
    constructor(name: string, data: any);
}
