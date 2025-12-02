import { IBoardService } from "../interfaces/IBoard/IBoardService";
import { BoardDTO } from "../models/DTOs/BoardDTO";
import { BoardInfoDTO } from "../models/DTOs/BoardInfoDTO";
import { BoardRepository } from "../repositories/BoardsRepository";
import { BoardService } from "../services/BoardService";
import { Request } from "express";
import { Response } from "express";

export class BoardController{

    private readonly _service:IBoardService

    constructor(){
        const repo=new BoardRepository();
        this._service=new BoardService(repo);
    }

    createBoard=async(req:Request, res:Response) : Promise<Response> =>{
        try{
            const dto:BoardDTO=req.body;
            const boardCreated=await this._service.createBoard(dto);
            if(boardCreated==null){
                return res.status(400).json({message:"no hemos logrado crear el tablero"});
            }

            return res.status(201).json(boardCreated);

        }catch(error:any){
            console.log(`Ha ocurrido un error inesperado ${error}`);
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});

        }

    }

    getAllBoardsByOwnerId=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {userId}=req.params;
            if(!userId){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            const response=await this._service.getAllBoardByOnwnerId(userId);
            if(response==null){
                return res.status(404).json({message:'el usuario aun no tiene tableros creados'});
            }

            return res.status(200).json(response);

        }catch(error){
            console.log(`Ha ocurrido un error inesperado ${error}`);
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});
        }
    }

    getBoardById=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            const response=await this._service.getBoardById(id);
            if(response==null){
                return res.status(404).json({message:'no existe el tablero que buscas'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            console.log(`Ha ocurrido un error inesperado ${error}`);
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});
        }

    }

    updateBoard=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            const dto:BoardDTO=req.body;

            if(!id){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            if(!dto){
                return res.status(400).json({message:'debes de diligenciar los campos que quieres actualizar'});
            }

            const response=await this._service.updateBoard(id,dto);
            if(response==null){
                return res.status(400).json({message:'no hemos logrado actualizar el tablero'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            console.log(`Ha ocurrido un error inesperado ${error}`);
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});
        }

    }
}