import { BoardDTO } from "../DTOs/BoardDTO";

export class BoardEntity extends BoardDTO{
    fechaCreacion!: Date;
    estado!:string;
}