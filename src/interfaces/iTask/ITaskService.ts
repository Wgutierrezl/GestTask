import { TaskDTO } from "../../models/DTOs/TaskDTO";
import { TaskUpdateDTO } from "../../models/DTOs/TaskUpdateDTO";
import { TaskEntity } from "../../models/entities/TaskEntity";

export interface ITaskService{
    createTask(data:TaskDTO) : Promise<TaskEntity | null>;
    getAllTaskByPipelineId(id:string) : Promise<TaskEntity[] | null>;
    getTaskByUserId(userId:string) : Promise<TaskEntity[] | null>;
    getTaskById(id:string) : Promise<TaskEntity | null>;
    updateTask(id:string, data:TaskDTO) : Promise<TaskUpdateDTO | null>;
}