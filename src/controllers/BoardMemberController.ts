import { IBUsersService } from "../interfaces/IBUsers/IBUsersService";
import { AuthRequest } from "../middleware/genericMiddleware";
import { BoardsUsersDTO } from "../models/DTOs/BoardsUsersDTO";
import { BUsersRepository } from "../repositories/BUsersRepository";
import { BUsersService } from "../services/BUsersService";
import { Request, Response } from "express";

export class BoardMemberController{
    
    private readonly _service: IBUsersService
    constructor(){
        const repo=new BUsersRepository();

        this._service=new BUsersService(repo);
    }


    //ENDPOINT TO CREATE A MEMBER
    createMember=async(req:Request, res:Response ) : Promise<Response> => {
        try{
            const dto:BoardsUsersDTO=req.body;


            const createdMember=await this._service.addMember(dto);
            if(!createdMember){
                return res.status(400).json({message:'no hemos logrado agregar el miembro al tablero'});
            }

            return res.status(201).json(createdMember);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message | error}`});

        }
    }


    //ENDPOINT TO GET ALL BOARDS_MEMBERS BY USERID
    getAllBoardMemberByUserId=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {userId}=req.params;
            if(!userId){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            const boardMembers=await this._service.getBoardsByMemberId(userId);
            if(!boardMembers){
                return res.status(400).json({message:'el usuario aun no ha sido agregado a ningun tablero'});
            }

            return res.status(200).json(boardMembers);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message | error}`});
        }
    }


    //ENDPOINT TO GET BOARD_MEMBER BY ID
    getBoardMemberById=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            const boardMembers=await this._service.getBoardUserById(id);
            if(!boardMembers){
                return res.status(404).json({message:'no hemos encontrado el resgitro que buscas'});
            }

            return res.status(200).json(boardMembers);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message | error}`});
        }
    }

    //ENDPOINT TO GET MEMBERS BY BOARD_ID
    getAllMembersByBoardId=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {boardId}=req.params;
            if(!boardId){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            const boardMembers=await this._service.getBoardMemberByBoardId(boardId);
            if(!boardMembers){
                return res.status(400).json({message:'aun no hay usuarios agregados a este tablero'});
            }

            return res.status(200).json(boardMembers);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message | error}`});
        }
    }

    //ENDPOINT TO GET BOARD_MEMBER BY USER ID AND BOARD_ID
    getMemberByBoardId=async(req:AuthRequest, res:Response) : Promise<Response> => {
        try{

            const userId=req.user?.id;
            if(!userId){
                return res.status(400).json({message:'no hemos identificado tu id dentro del token'});
            }

            const {boardId}=req.params;
            if(!boardId){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            const boardMembers=await this._service.getBoardMemberByUserAndBoardId(userId,boardId);
            if(!boardMembers){
                return res.status(400).json({message:'aun no hay usuarios agregados a este tablero'});
            }

            return res.status(200).json(boardMembers);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message | error}`});
        }
    }

    //ENDPOINT TO UPDATE A MEMBER BY ID
    updateBoardMemberById=async(req:Request, res:Response ) : Promise<Response> => {
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:'debes de digitar el id'});
            }
            const dto:BoardsUsersDTO=req.body;
            if(!dto){
                return res.status(400).json({message:'debes de llenar los atributos si quieres actualizar algo'});
            }



            const memberUpdated=await this._service.updateMemberById(id,dto);
            if(!memberUpdated){
                return res.status(400).json({message:'no hemos logrado actualizar la informacion del miembro'});
            }

            return res.status(200).json(memberUpdated);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message | error}`});

        }
    }


    //ENDPOINT TO DELETE A MEMBER BY ID 
    deleteBoardMemberById=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            const deleted=await this._service.deleteMemberBoard(id);
            if(!deleted){
                return res.status(404).json({message:'no hemos encontrado el registro que deseas eliminar'});
            }

            return res.status(200).json({message:'miembro del tablero eliminado correctamente',success:deleted});

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message | error}`});
        }
    }


}