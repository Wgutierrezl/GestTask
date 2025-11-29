import { UserDTO } from "../../models/DTOs/UserDTO";
import { UserEntity } from "../../models/entities/UserEntity";

export interface IUserRepository {
    createUser(user:UserEntity): Promise<any>;
    getUserByEmail(correo: string): Promise<any>;
    getUserById(id: string): Promise<any>;
}