import { File } from "buffer";

export interface IB2Service{
    uploadFile(data:Buffer,nombreArchivo:string) : Promise<string>;
    getUriFile(nameFile:string) : Promise<string>;

}