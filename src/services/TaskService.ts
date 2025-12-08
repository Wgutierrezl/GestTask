import { ITaskRepository } from "../interfaces/iTask/ITaskRepository";
import { ITaskService } from "../interfaces/iTask/ITaskService";
import { TaskDTO } from "../models/DTOs/TaskDTO";
import { TaskUpdateDTO } from "../models/DTOs/TaskUpdateDTO";
import { TaskEntity } from "../models/entities/TaskEntity";

export class TaskService implements ITaskService{

    private readonly _repo:ITaskRepository

    constructor(repo:ITaskRepository){
        this._repo=repo;
    }

    //METHOD TO DELETE A TASK
    async deleteTask(id: string): Promise<any | null> {
        const task=await this._repo.getTaskById(id);
        if(task==null){
            return null;
        }

        const deleted=await this._repo.deleteTask(id);
        if(!deleted){
            throw new Error('no hemos logrado eliminar la tarea');
        }

        return deleted;
    }

    //METHOD TO UPDATE A TASK
    async updateTask(id: string, data: TaskDTO): Promise<TaskUpdateDTO | null> {
        let task=await this._repo.getTaskById(id);
        console.log(task);
        if(task==null){
            return null;
        }

        console.log(`id capturado de la tarea ${task._id}`);
        task.titulo=data.titulo;
        task.descripcion=data.descripcion;
        
        if(data.asignadoA!=null){
            task.asignadoA=data.asignadoA;
        }

        if(data.etapaId!=null){
            task.etapaId=data.etapaId;
        }

        if(data.pipelineId!=null){
            task.pipelineId=data.pipelineId;
        }

        if(data.tableroId!=null){
            task.tableroId=data.tableroId;
        }

        task.priodidad=data.priodidad;

        const taskUpdated=await this._repo.updateTask(task);
        if(taskUpdated==null){
            throw new Error('no hemos logrado actualizar la tarea');
        }

        return this.fillObjectTaskInfo(taskUpdated);
        


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

        task.tableroId=data.tableroId;


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
    async getAllTaskByUser_Pipe_Board_Id(userId: string, pipelineId:string , boardId:string): Promise<TaskEntity[] | null> {
        const response=await this._repo.getAllTaskByUser_Pipe_Board_Id(userId, pipelineId, boardId);
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

    //METHOD TO COMPLETE THE ATTRIBUTES BY TASK
    fillObjectTaskInfo(data:any) : TaskUpdateDTO {
        return {
            _id:data._id,
            titulo:data.titulo,
            descripcion: data.descripcion,
            pipelineId: data.pipelineId,
            etapaId: data.etapaId,
            asignadoA: data.asignadoA,
            priodidad: data.prioridad,
            fechaLimite: data.fechaLimite,
            fechaFinalizacion: data.fechaFinalizacion
        }

    }
    
}