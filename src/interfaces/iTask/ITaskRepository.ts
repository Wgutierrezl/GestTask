import { TaskUpdateDTO } from "../../models/DTOs/TaskUpdateDTO";
import { TaskEntity } from "../../models/entities/TaskEntity";

export interface ITaskRepository{
    createTask(data:TaskEntity) : Promise<any>;
    getAllTaskByPipelineId(id:string) : Promise<TaskEntity[]>
    getAllTaskByUserId(id:string) : Promise<TaskEntity[]>;
    getTaskById(id:string) : Promise<any | null>;
    updateTask(data:TaskUpdateDTO) : Promise<any>;
}