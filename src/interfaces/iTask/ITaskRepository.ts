import { TaskUpdateDTO } from "../../models/DTOs/TaskUpdateDTO";
import { TaskEntity } from "../../models/entities/TaskEntity";

export interface ITaskRepository{
    createTask(data:TaskEntity) : Promise<any>;
    getAllTaskByPipelineId(id:string) : Promise<any[]>
    getAllTaskByUser_Pipe_Board_Id(userId:string, pipelineId:string, boardId:string) : Promise<TaskEntity[]>;
    getTaskById(id:string) : Promise<any | null>;
    updateTask(data:TaskUpdateDTO) : Promise<any>;
    deleteTask(id:string) : Promise<any>;
    deleteTasksByPipelineId(pipelineId:string) : Promise<any>;
}