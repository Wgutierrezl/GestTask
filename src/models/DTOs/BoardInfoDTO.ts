import { BoardDTO } from "./BoardDTO";

export class BoardInfoDTO extends BoardDTO{
    _id!:string
    ownerId!:string
    estado?:string;
}