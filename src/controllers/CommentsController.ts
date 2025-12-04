import { Request,Response } from "express";
import { ICommentsService } from "../interfaces/IComments/ICommentsService";
import { ICommentsRepository } from "../interfaces/IComments/ICommentsRepository";
import { IB2Service } from "../interfaces/IB2/IB2Service";
import { CommentsRepository } from "../repositories/CommentsRepository";
import { B2Service } from "../services/B2Service";
import { CommentService } from "../services/CommentService";
import { CreateCommentDTO } from "../models/DTOs/CommentsDTO";
import { UpdateCommentFileDTO } from "../models/DTOs/CommentUpdateDTO";


export class CommentsController{

    private readonly _service:ICommentsService;

    constructor(){
        const repo=new CommentsRepository();
        const b2=new B2Service();
        this._service=new CommentService(repo,b2);
    }


    //ENDPOINT TO CREATE A COMMENT
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



            // ─────────────────────────────────────
                // NORMALIZAR req.files (FIX DEFINITIVO)
            // ─────────────────────────────────────
            /* let normalizedFiles: Express.Multer.File[] = [];

            if (req.files && Array.isArray(req.files)) {
                req.files.forEach((item) => {
                    if (Array.isArray(item)) {
                        normalizedFiles.push(...item);
                    } else {
                        normalizedFiles.push(item);
                    }
                });
            }

            // Mapear archivos al DTO
            dto.archivos = normalizedFiles.map(file => ({
                originalName: file.originalname,
                buffer: file.buffer,
                size: file.size
            })); */


            const commentCreated=await this._service.createComment(dto);
            if(commentCreated==null){
                return res.status(400).json({message:'no hemos logrado crear el comentario'});
            }

            return res.status(201).json(commentCreated);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});
        }
    }

    //ENDPOINT TO UPDATE A COMMENT BY ID AND THE BODY THE OBJECT
    updateCommentById=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:'debes de diligenciar el id'});
            }
            const dto:UpdateCommentFileDTO={
                mensaje: req.body.mensaje ?? undefined,
                archivosEliminar:[],
                archivosCargados: []
            };

            // 1. ARCHIVOS A ELIMINAR (array de strings)
            if (req.body.archivosEliminar) {

                if (Array.isArray(req.body.archivosEliminar)) {
                    dto.archivosEliminar = req.body.archivosEliminar;
                } else {
                    // si viene como string JSON
                    dto.archivosEliminar = JSON.parse(req.body.archivosEliminar);
                }
            }

            // 2. Verificar si vienen archivos
            if (req.files && Array.isArray(req.files)) {
                dto.archivosCargados = req.files.map((file: Express.Multer.File) => ({
                    originalName: file.originalname,
                    buffer: file.buffer,
                    size: file.size
                }));
            }


            const result=await this._service.updateCommentsById(id, dto);
            if(!result){
                return res.status(400).json({message:'no hemos logrado actualizar el comentario'});
            }

            return res.status(200).json(result);


        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});
        }
    }


    //ENDPOINT TO DOWNLOAD FILE BY COMMENT_ID AND FILE_ID
    downloadFileByCommentId=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {commentId}=req.params
            const {fileId}=req.params;
            if(!commentId || !fileId){
                return res.status(400).json({message:'debes de diligenciar el id para ambos casos'});
            }

            const response=await this._service.downloadFile(commentId,fileId);

            if(!response){
                return res.status(400).json({message:'no hemos logrado descargar el archivo de esta tarea'});
            }

            return res.status(200).json(response);

            
        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});

        }
    }


    //ENDPOINT TO DELETE COMMENT AND THEIR FILES BY B2
    deleteComment=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:'debes de digitar el id'});
            }

            const deleted=await this._service.deleteComment(id);
            if(!deleted){
                return res.status(400).json({message:'no hemos logrado eliminar el comentario'});
            }

            return res.status(200).json({message:'registro eliminado correctamente',success:deleted});

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});
        }
    }


    //ENDPOINT TO GET ALL COMMENTS BY TASK ID
    getAllCommentsByTaskId=async(req: Request, res:Response) : Promise<Response> =>{
        try{
            const {taskId}=req.params;
            if(!taskId){
                return res.status(400).json({message:'debes de diligenciar el ID'});
            }

            const response=await this._service.getAllCommentsByTaskId(taskId);
            if(!response){
                return res.status(400).json({message:'aun no hay comentarios para esa tarea'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});  
        }
    }

    //METHOD TO GET COMMENT BY ID
    getCommentById=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:'debes de diligenciar el ID'});
            }

            const comment=await this._service.getCommentById(id);
            if(!comment){
                return res.status(404).json({message:'no hemos encontrado el comentario que buscas'});
            }

            return res.status(200).json(comment);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error}`});
        }
    }

}