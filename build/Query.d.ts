import IEntity from "./interfaces/IEntity";
import IQuery from "./interfaces/IQuery";
export default class Query implements IQuery {
    entities: IEntity[];
    add(entity: IEntity): this;
    has(entity: IEntity): boolean;
    remove(entity: IEntity): this;
}
