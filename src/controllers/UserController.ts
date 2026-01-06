import { Request,Response } from "express";
import { IUserService } from "../interfaces/iUser/IUserService";
import { UserDTO } from "../models/DTOs/UserDTO";
import { json } from "stream/consumers";
import { LoginDTO } from "../models/DTOs/LoginDTO";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import { TokenService } from "../custom/TokenService";
import { HasherService } from "../custom/HasherService";
import { AuthRequest } from "../middleware/genericMiddleware";
import { auth } from "express-oauth2-jwt-bearer";

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


    loginOauth0=async(req:Request, res:Response) : Promise<Response> => {
        try{
            /* const {sub, email, name} = (req as any).auth.payload */

            const authHeader=req.headers.authorization;
            if(!authHeader){
                return res.status(401).json({ message: 'Token no enviado' });
            }

            const session=await this._service.loginOauth0(authHeader);
            if(!session){
                return res.status(400).json({message:'no hemos logrado autenticar el usuario'});
            }

            return res.status(200).json(session);

        }catch(error:any){
            console.error(error);
            return res.status(401).json({
                message: 'Error al autenticar con OAuth0'
            });
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


    getProfile=async(req:AuthRequest, res:Response) : Promise<Response> => {
        try{
            const userId=req.user?.id;
            if(!userId){
                return res.status(400).json({message:'el id del usuario no esta en el token'});
            }

            const response=await this._service.getUserById(userId);
            if(!response){
                return res.status(404).json({message:'no encontramos el usuario que buscas'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }
    //-- DRAFT
    getTotalUsers=async(req:AuthRequest, res:Response) : Promise<Response> => {
        try{
            const response=await this._service.getTotalUsersCount();
            if(!response){
                return res.status(400).json({message:'no hemos logrado acceder a las cantidades de usuarios'});
            }
            
            return res.status(200).json(response);
            
        }catch(error:any){
            return res.status(400).json({message:`ha ocurrido un error inesperado ${error.message}`});
        }
    }
}