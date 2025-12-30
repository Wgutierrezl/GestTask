import { ICommentsService } from "../interfaces/IComments/ICommentsService";
import { ITaskRepository } from "../interfaces/iTask/ITaskRepository";
import { ITaskService } from "../interfaces/iTask/ITaskService";
import { StageDTO } from "../models/DTOs/StageDTO";
import { TaskDTO } from "../models/DTOs/TaskDTO";
import { TaskInfoDTO, TaskUpdate, TaskUpdateDTO } from "../models/DTOs/TaskUpdateDTO";
import { TaskEntity } from "../models/entities/TaskEntity";

export class TaskService implements ITaskService{

    private readonly _repo:ITaskRepository
    private readonly _commentsService: ICommentsService

    constructor(repo:ITaskRepository, commentsService:ICommentsService){
        this._repo=repo;
        this._commentsService=commentsService;

    }

    //Method to Update a Task
    async updateTaskById(id: string, data: TaskUpdate): Promise<TaskInfoDTO | null> {
        const task=await this._repo.getTaskById(id);
        console.log(`tarea encontrado ${task}`);

        if(!task){
            return null;
        }

        if(data.titulo){
            task.titulo=data.titulo
        };

        if(data.priodidad){
            task.priodidad=data.priodidad;
        }

        if(data.estado){
            task.estado=data.estado;
        }

        if(data.fechaLimite){
            task.fechaLimite=data.fechaLimite;
        }

        if(data.fechaFinalizacion){
            task.fechaFinalizacion=data.fechaFinalizacion;
        }

        if(data.descripcion){
            task.descripcion=data.descripcion;
        }

        if(data.asignadoA){
            task.asignadoA=data.asignadoA;
        }

        const taskUpdated=await this._repo.updateTask(task);
        console.log(`tarea actualizada correctamente ${taskUpdated}`);

        if(!taskUpdated){
            throw new Error('no hemos logrado actualizar la tarea');
        }

        return taskUpdated;

    }

    //METHOD TO UPDATE STAGE BY TASK ID
    async updateStageByTaskId(taskId: string, stage:StageDTO): Promise<TaskUpdateDTO | null> {
        let task=await this._repo.getTaskById(taskId);
        console.log(`tarea encontrada ${task}`);
        if(!task){
            return null;
        }

        if(task.etapaId==stage.stageId){
            throw new Error("no puedes cambiar la etapa de la tarea en la que ya se encuentra");
        }

        task.etapaId=stage.stageId;

        const taskUpdated=await this._repo.updateTask(task);
        console.log(`tarea actualizada ${taskUpdated}`);

        return this.fillObjectTaskInfo(taskUpdated);
        
    }

    //METHOD TO DELETE TASKS BY PIPELINE ID
    //First, we delete all comments related to the tasks in the pipeline, then we delete the tasks
    async deleteTasksByPipelineId(pipelineId: string): Promise<any | null> {

        //First, get all tasks by pipeline ID
        const tasks=await this._repo.getAllTaskByPipelineId(pipelineId);
        if(tasks.length===0 || tasks===null){
            return null;
        }

        //We create an array of task IDs
        const tasksId=tasks.map(task=>task._id.toString());

        //Then, we get all comments related to the array of tasks
        const comments=await this._commentsService.getCommentsByTaskId(tasksId);
        if(comments && comments.length>0)
        {
            //Then, we delete all comments related to the tasks
            const deletedComments=await this._commentsService.deleteCommentsByTaskId(tasksId);
            if(!deletedComments){
                throw new Error('no hemos logrado eliminar los comentarios de las tareas');
            }
        }
        
        //Finally, we delete all tasks by pipeline id
        const deleted=await this._repo.deleteTasksByPipelineId(pipelineId);
        if(!deleted){
            throw new Error('no hemos logrado eliminar las tareas');
        }
        return deleted;
    }

    //METHOD TO DELETE A TASK
    async deleteTask(id: string): Promise<any | null> {
        const task=await this._repo.getTaskById(id);
        if(task==null){
            return null;
        }

        //first, we get all comments related to the task
        const comments=await this._commentsService.getAllCommentsByTaskId(id);
        if(comments && comments.length>0){

            //then, we delete all comments related to the task
            const deletedComments=await this._commentsService.deleteCommentsByTaskId([id]);
            if(!deletedComments){
                throw new Error('no hemos logrado eliminar los comentarios de la tarea');
            }
        }

        //then, we delete the task
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