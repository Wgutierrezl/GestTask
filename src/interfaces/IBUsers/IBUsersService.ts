import { BoardsUsersDTO } from "../../models/DTOs/BoardsUsersDTO";
import { BUserInfoDTO } from "../../models/DTOs/BUsersInfoDTO";

export interface IBUsersService {
    addMember(data:BoardsUsersDTO) : Promise<any | null>;
    getBoardsByMemberId(userId:string) : Promise<any[] | null>;
    getBoardUserById(id:string) : Promise<any | null>;
    getBoardMemberByUserAndBoardId(userId:string, boardId:string) : Promise<any>;
    updateMemberById(id:string, data:BoardsUsersDTO) : Promise<any | null>;
    deleteMemberBoard(id:string) : Promise<any>;
    deleteMembersByBoardId(boardId:string) : Promise<any>;
    getBoardMemberByBoardId(boardId:string) : Promise<any[] | null>;
}