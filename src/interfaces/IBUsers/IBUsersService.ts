import { BoardsUsersDTO } from "../../models/DTOs/BoardsUsersDTO";
import { BUserInfoDTO } from "../../models/DTOs/BUsersInfoDTO";

export interface IBUsersService {
    addMember(data:BoardsUsersDTO) : Promise<any>;
    getBoardsByMemberId(userId:string) : Promise<any[]>;
    getBoardUserById(id:string) : Promise<any>;
    updateMemberById(data:BUserInfoDTO) : Promise<any>;
    deleteMemberBoard(id:string) : Promise<any>;
}