import { Request,Response } from "express";
import { ITaskService } from "../interfaces/iTask/ITaskService";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskService } from "../services/TaskService";
import { TaskDTO } from "../models/DTOs/TaskDTO";
import { promises } from "dns";
import { AuthRequest } from "../middleware/genericMiddleware";
import { CommentsRepository } from "../repositories/CommentsRepository";
import { B2Service } from "../services/B2Service";
import { CommentService } from "../services/CommentService";
import { StageDTO } from "../models/DTOs/StageDTO";

export class TaskController{

    private readonly _service:ITaskService;

    constructor(){
        const repo=new TaskRepository();
        const commentRepo=new CommentsRepository()
        const b2Service=new B2Service();
        const commentService=new CommentService(commentRepo, b2Service);

        this._service=new TaskService(repo, commentService);
    }


    createNewTask=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const dto:TaskDTO=req.body;
            const response=await this._service.createTask(dto);
            if(response==null){
                return res.status(400).json({message:"no hemos logrado crear la tarea"});
            }

            return res.status(201).json(response);

        }catch(error:any){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }


    updateTask=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            const dto:TaskDTO=req.body;

            if(!id){
                return res.status(400).json({message:'debes de diligenciar el id'});
            }

            if(!dto){
                return res.status(400).json({message:'debes de diligenciar el objeto'});
            }

            const response=await this._service.updateTask(id,dto);
            if(response==null){
                return res.status(400).json({message:'no hemos logrado actualizar la informacion de la task'});
            }

            return res.status(200).json(response);

        }catch(error){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }

    updateStageTask=async(req:AuthRequest, res:Response) : Promise<Response> => {
        try{
            const {taskId}=req.params;
            if(!taskId){
                return res.status(400).json({message:'debes de digitar el id de la tarea'});
            }
            const dto:StageDTO=req.body;

            const response=await this._service.updateStageByTaskId(taskId, dto);
            if(!response){
                return res.status(400).json({message:'no hemos logrado actualizar la etapa de la tarea'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.Response}`})
        }
    }


    getTaskByPipelineId=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {pipelineId}=req.params;
            console.log("pipelineId ",pipelineId);
            if(!pipelineId){
                return res.status(400).json({message:"Debes de digitar el id"});
            }

            const response=await this._service.getAllTaskByPipelineId(pipelineId);
            if(response==null){
                return res.status(404).json({message:"aun no hay tareas para este pipeline"});
            }

            return res.status(200).json(response);

        }catch(error){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }


    getTaskByUser_Pipeline_Board=async(req: Request, res:Response) : Promise<Response> => {
        try{
            const {userId}=req.params;
            if(!userId){
                return res.status(400).json({message:"Debes de digitar el id del usuario"});
            }

            const {pipelineId}=req.params;
            if(!pipelineId){
                return res.status(400).json({message:"Debes de digitar el id del pipeline"});
            }

            const {boardId}=req.params;
            if(!boardId){
                return res.status(400).json({message:"Debes de digitar el id del tablero"});
            }

            const response=await this._service.getAllTaskByUser_Pipe_Board_Id(userId, pipelineId, boardId);
            if(response==null){
                return res.status(404).json({message:"el usuario aun no ha registrado tareas"});
            }

            return res.status(200).json(response);

        }catch(error:any){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }


    getTaskById=async(req: Request, res:Response) : Promise<Response> => {
        try{

            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:"Debes de digitar el id"});
            }

            const response=await this._service.getTaskById(id);
            if(response==null){
                return res.status(404).json({message:"no existe la tarea que deseas buscas"});
            }

            return res.status(200).json(response);


        }catch(error:any){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }

    
    deleteTask=async(req: Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            if(!id){
                return res.status(400).json({message:'debes de diligenciar el id'});
            }

            const deleted=await this._service.deleteTask(id);
            if(!deleted){
                return res.status(400).json({message:'no hemos logrado eliminar la tarea'});
            }

            return res.status(204).json({message:'tarea eliminada correctamente'});


        }catch(error:any){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }


    deleteTaskByPipelineId=async(req:AuthRequest, res:Response) : Promise<Response> => {
        try{
            const {pipelineId}=req.params;
            if(!pipelineId){
                return res.status(400).json({message:'debes de digitar el id del pipeline'});
            }
            const deleted=await this._service.deleteTasksByPipelineId(pipelineId);
            if(!deleted){
                return res.status(400).json({message:'no hemos logrado eliminar las tareas del pipeline'});
            }
            return res.status(200).json({message:'tareas eliminadas correctamente', success:deleted});

        }catch(error:any){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }


    getMyTaskByPipeline_Board_Id=async(req:AuthRequest, res:Response) => {
        try{
             const userId=req.user?.id;
             if(!userId){
                return res.status(400).json({message:'debes de digitar el id'});
             }

             const {pipelineId}=req.params;
             if(!pipelineId){
                return res.status(400).json({message:'debes de digitar el id'});
             }

             const {boardId}=req.params;
             if(!boardId){
                return res.status(400).json({message:"Debes de digitar el id del tablero"});
             }

             const response=await this._service.getAllTaskByUser_Pipe_Board_Id(userId, pipelineId, boardId);
             if(response==null){
                return res.status(404).json({message:"el usuario aun no ha registrado tareas"});
             }

             return res.status(200).json(response);


        }catch(error:any){
            console.log(error);
            return res.status(500).json({message:`Ha ocurrido un error inesperado ${error}`});
        }
    }

}