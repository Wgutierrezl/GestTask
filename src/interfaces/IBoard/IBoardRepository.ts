import { BoardDTO } from "../../models/DTOs/BoardDTO";
import { BoardUpdateDTO } from "../../models/DTOs/BoardUpdateDTO";
import { BoardEntity } from "../../models/entities/BoardsEntity";

export interface IBoardRepository{
    createBoard(data:BoardEntity) : Promise<any>;
    getBoardsByOnwerId(userId: string) : Promise<any[]>;
    /* getBoardsByPipelineId(pipelineId: string) : Promise<any[]>; */
    getBoardById(id:string) : Promise<any | null>;
    updateBoards(data:BoardUpdateDTO) : Promise<any>;
    deleteBoardById(id: string) : Promise<any>;

}