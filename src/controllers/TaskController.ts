import { Request,Response } from "express";
import { ITaskService } from "../interfaces/iTask/ITaskService";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskService } from "../services/TaskService";
import { TaskDTO } from "../models/DTOs/TaskDTO";
import { promises } from "dns";

export class TaskController{

    private readonly _service:ITaskService;

    constructor(){
        const repo=new TaskRepository();

        this._service=new TaskService(repo);
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

    getTaskByUserId=async(req: Request, res:Response) : Promise<Response> => {
        try{
            const {userId}=req.params;
            if(!userId){
                return res.status(400).json({message:"Debes de digitar el id"});
            }

            const response=await this._service.getTaskByUserId(userId);
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

}