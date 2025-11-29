import { UserInfoDTO } from "../models/DTOs/UserInfoDTO";

export interface ITokenService{
    generateToken(userData:UserInfoDTO): string
}