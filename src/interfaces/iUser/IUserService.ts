import { LoginDTO } from "../../models/DTOs/LoginDTO";
import { SessionDTO } from "../../models/DTOs/SessionDTO";
import { UserDTO } from "../../models/DTOs/UserDTO";
import { UserInfoDTO } from "../../models/DTOs/UserInfoDTO";

export interface IUserService{
    createUser(user:UserDTO): Promise<UserDTO>;
    login(loginDTO:LoginDTO): Promise<SessionDTO | null>;
    getUserById(id:string): Promise<UserInfoDTO | null>;
}