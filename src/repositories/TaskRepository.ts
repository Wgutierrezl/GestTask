import { ITaskRepository } from "../interfaces/iTask/ITaskRepository";
import { Tarea } from "../models/entities/Tareas";
import { TaskEntity } from "../models/entities/TaskEntity";

export class TaskRepository implements ITaskRepository{

    //METHOD TO CREATE A NEW TASK
    async createTask(data: TaskEntity): Promise<any> {
        const task=new Tarea(data);
        return await task.save();
    }

    //METHOD TO GET ALL TASK BY PIPELINEID
    async getAllTaskByPipelineId(id: string): Promise<TaskEntity[]> {
        return await Tarea.find({pipelineId:id});
        
    }

    //METHOD TO GET ALL TASK BY USERID
    async getAllTaskByUserId(id: string): Promise<TaskEntity[]> {
        return await Tarea.find({asignadoA:id});
    }

    //METHOD TO GET TASK BY ID
    async getTaskById(id: string): Promise<TaskEntity | null> {
        return await Tarea.findById(id);
    }
    
}