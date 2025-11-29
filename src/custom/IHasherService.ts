export interface IhasherService{
    encryptPassword(password: string): string;
    comparePassword(password:string, hashed:string):boolean;
}