export interface IS3Service{
    uploadFile(data:Buffer,nombreArchivo:string) : Promise<string>;
    getUriFile(nameFile:string) : Promise<string>;
    deleteFile(fileName:string) : Promise<void>;
}