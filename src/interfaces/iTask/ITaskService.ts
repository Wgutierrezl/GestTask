import { TaskDTO } from "../../models/DTOs/TaskDTO";
import { TaskEntity } from "../../models/entities/TaskEntity";

export interface ITaskService{
    createTask(data:TaskDTO) : Promise<TaskEntity | null>;
    getAllTaskByPipelineId(id:string) : Promise<TaskEntity[] | null>;
    getTaskByUserId(userId:string) : Promise<TaskEntity[] | null>;
    getTaskById(id:string) : Promise<TaskEntity | null>;
}