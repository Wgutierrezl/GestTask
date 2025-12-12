import { BUserInfoDTO } from "../../models/DTOs/BUsersInfoDTO";
import { BUsersEntity } from "../../models/entities/BUsersEntity";

export interface IBUsersRepository{
    addMember(data:BUsersEntity) : Promise<any>;
    getBoardsByMemberId(userId:string) : Promise<any[]>;
    getBoardUserById(id:string) : Promise<any>;
    getBoardMemberByUserAndBoardId(userId:string, boardId:string) : Promise<any>;
    updateMemberById(data:any) : Promise<any>;
    deleteMemberBoard(id:string) : Promise<any>;
    getBoardMemberByBoardId(boardId:string) : Promise<any[]>;
}