import { LoginDTO } from "../../models/DTOs/LoginDTO";
import { Payload } from "../../models/DTOs/Payload";
import { SessionDTO } from "../../models/DTOs/SessionDTO";
import { UserDTO } from "../../models/DTOs/UserDTO";
import { UserInfoDTO } from "../../models/DTOs/UserInfoDTO";

export interface IUserService{
    createUser(user:UserDTO): Promise<UserInfoDTO>;
    login(loginDTO:LoginDTO): Promise<SessionDTO | null>;
    getUserById(id:string): Promise<UserInfoDTO | null>;
    getAllUsers() : Promise<UserInfoDTO | null>;
    loginOauth0(accessToken:string) : Promise<SessionDTO>;

    getTotalUsersCount() : Promise<number>;
}