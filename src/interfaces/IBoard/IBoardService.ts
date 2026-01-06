import { BoardDTO } from "../../models/DTOs/BoardDTO";
import { BoardInfoDTO } from "../../models/DTOs/BoardInfoDTO";

export interface IBoardService{
    createBoard(data:BoardDTO, ownerId:string) : Promise<BoardInfoDTO | null>;
    getAllBoardByOnwnerId(userId: string) : Promise<BoardInfoDTO[] | null>;
    getBoardsByOnerId(userId:string) : Promise<BoardInfoDTO[] | null>;
    getBoardById(id:string) : Promise<BoardInfoDTO | null>;
    updateBoard(id:string, data:BoardDTO) : Promise<BoardInfoDTO | null>;
    deleteBoardById(id:string) : Promise<any | null>;

    getTotalBoardsCount() : Promise<number>;
}