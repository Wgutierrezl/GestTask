import { Request,Response } from "express";
import { IUserService } from "../interfaces/iUser/IUserService";
import { UserDTO } from "../models/DTOs/UserDTO";
import { json } from "stream/consumers";
import { LoginDTO } from "../models/DTOs/LoginDTO";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { TokenService } from "../custom/TokenService";
import { HasherService } from "../custom/HasherService";

export class UserController{

    private readonly _service:IUserService;

    constructor(){
        const userRepository=new UserRepository;
        const tokenService=new TokenService;
        const hashed=new HasherService;
        
        this._service=new UserService(userRepository,tokenService,hashed);
    }


    createUser=async(req:Request, res:Response): Promise<Response>=>{
        try{
            const dto:UserDTO=req.body;

            const result=await this._service.createUser(dto);
            console.log(result);
            return res.status(201).json(result);
        }catch(error:any){
            console.error(error);
            return res.status(500).json({ message: "Error al registrar el usuario" });
        }
    }

    loginUser=async(req:Request,res:Response):Promise<Response> => {
        try{
            const dto:LoginDTO=req.body;
            const user=await this._service.login(dto);
            console.log(user);
            return res.status(200).json(user);
        }catch(error:any){
            console.error(error);
            return res.status(500).json({ message: "No hemos logrado logear a el usuario" });
        }
    }

    getUserById=async(req:Request, res:Response): Promise<Response> => {
        try{

            const {id}=req.params;

            if (!id) {
                return res.status(400).json({ message: "El ID es requerido" });
            }

            const user=await this._service.getUserById(id);
            if(user==null){
                return res.status(404).json({message:"El usuario no existe"});
            }

            return res.status(200).json(user);

        }catch(error:any){
            console.error(error);
            return res.status(500).json({ message: "No hemos logrado encontrar el usuario"});
        }
    }


    getAllUsers=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const response=await this._service.getAllUsers();
            if(response==null){
                return res.status(404).json({message:"aun no hay usuarios registrados en el sistema"});
            }

            return res.status(200).json(response);

        }catch(error:any){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }
}