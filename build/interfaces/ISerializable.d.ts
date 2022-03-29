export default interface ISerializable {
    serialize(): any;
}
export interface ISerializedJson {
    type: any;
    [key: string]: any;
}
