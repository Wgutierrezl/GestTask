import { Request,Response } from "express";
import { ICommentsService } from "../interfaces/IComments/ICommentsService";
import { ICommentsRepository } from "../interfaces/IComments/ICommentsRepository";
import { IB2Service } from "../interfaces/IB2/IB2Service";
import { CommentsRepository } from "../repositories/CommentsRepository";
import { B2Service } from "../services/B2Service";
import { CommentService } from "../services/CommentService";
import { CreateCommentDTO } from "../models/DTOs/CommentsDTO";


export class CommentsController{

    private readonly _service:ICommentsService;

    constructor(){
        const repo=new CommentsRepository();
        const b2=new B2Service();
        this._service=new CommentService(repo,b2);
    }


    createComment=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const dto:CreateCommentDTO={
                tareaId:req.body.tareaId,
                usuarioId:req.body.usuarioId,
                mensaje:req.body.mensaje,
                archivos:[]
            };

            // 2. Verificar si vienen archivos
            if (req.files && Array.isArray(req.files)) {
                dto.archivos = req.files.map((file: Express.Multer.File) => ({
                    originalName: file.originalname,
                    buffer: file.buffer,
                    size: file.size
                }));
            }


            const commentCreated=await this._service.createComment(dto);
            if(commentCreated==null){
                return res.status(400).json({message:'no hemos logrado crear el comentario'});
            }

            return res.status(201).json(commentCreated);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});
        }
    }

}