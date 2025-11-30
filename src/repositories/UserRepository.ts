import { IUserRepository } from "../interfaces/iUser/IUserRepository";
import { UserDTO } from "../models/DTOs/UserDTO";
import { User } from "../models/entities/User";
import { UserEntity } from "../models/entities/UserEntity";


export class UserRepository implements IUserRepository{
    async getAllUsers(): Promise<any> {
        return await User.find();
    }


    async createUser(user: UserEntity): Promise<any> {
        const newUser=new User(user);
        return await newUser.save();
        
    }

    async getUserByEmail(correo: string): Promise<any> {
        return await User.findOne({correo});
    }

    async getUserById(id: string): Promise<any> {
        return await User.findById(id);
    }
    
}