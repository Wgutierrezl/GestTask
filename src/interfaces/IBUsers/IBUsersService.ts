import { BoardsUsersDTO } from "../../models/DTOs/BoardsUsersDTO";
import { BUserInfoDTO } from "../../models/DTOs/BUsersInfoDTO";

export interface IBUsersService {
    addMember(data:BoardsUsersDTO) : Promise<any | null>;
    getBoardsByMemberId(userId:string) : Promise<any[] | null>;
    getBoardUserById(id:string) : Promise<any | null>;
    updateMemberById(id:string, data:BoardsUsersDTO) : Promise<any | null>;
    deleteMemberBoard(id:string) : Promise<any>;
}