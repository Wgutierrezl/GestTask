import { ITaskRepository } from "../interfaces/iTask/ITaskRepository";
import { ITaskService } from "../interfaces/iTask/ITaskService";
import { TaskDTO } from "../models/DTOs/TaskDTO";
import { TaskEntity } from "../models/entities/TaskEntity";

export class TaskService implements ITaskService{

    private readonly _repo:ITaskRepository

    constructor(repo:ITaskRepository){
        this._repo=repo;
    }

    //METHOD TO CREATE A NEW TASK
    async createTask(data: TaskDTO): Promise<TaskEntity | null> {
        const task=new TaskEntity();

        task.titulo=data.titulo;
        task.descripcion=data.descripcion;
        task.pipelineId=data.pipelineId;
        task.asignadoA=data.asignadoA;
        task.etapaId=data.etapaId;
        task.priodidad=data.priodidad;
        task.estado="Activo";
        task.fechaCreacion=new Date();
        task.fechaLimite=data.fechaLimite;

        if(data.fechaFinalizacion!=undefined){
            task.fechaFinalizacion=data.fechaFinalizacion;
        }


        const taskCreated=await this._repo.createTask(task);
        console.log(taskCreated);
        if(taskCreated==null){
            return null;
        }

        return  taskCreated;

    }

    //METHOD TO GET ALL TASK BY PIPELINES
    async getAllTaskByPipelineId(id: string): Promise<TaskEntity[] | null> {
        const response=await this._repo.getAllTaskByPipelineId(id);
        console.log(response);
        if(response.length===0 || response==null){
            return null;
        }

        return response;
    }

    //METHOD TO GET ALL TASK BY USERID
    async getTaskByUserId(userId: string): Promise<TaskEntity[] | null> {
        const response=await this._repo.getAllTaskByUserId(userId);
        if(response.length===0 || response==null){
            return null;
        }

        return response;
    }


    //METHOD TO GET TASK BY ID
    async getTaskById(id: string): Promise<TaskEntity | null> {
        const response=await this._repo.getTaskById(id);
        console.log(response);
        if(response==null){
            return null;
        }

        return response;
    }
    
}