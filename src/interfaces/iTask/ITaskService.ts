import { StageDTO } from "../../models/DTOs/StageDTO";
import { TaskDTO } from "../../models/DTOs/TaskDTO";
import { TaskInfoDTO, TaskUpdate, TaskUpdateDTO } from "../../models/DTOs/TaskUpdateDTO";
import { TaskEntity } from "../../models/entities/TaskEntity";

export interface ITaskService{
    createTask(data:TaskDTO) : Promise<TaskEntity | null>;
    getAllTaskByPipelineId(id:string) : Promise<TaskEntity[] | null>;
    getAllTaskByUser_Pipe_Board_Id(userId:string, pipelineId:string, boardId:string) : Promise<TaskEntity[] | null>;
    getTaskById(id:string) : Promise<TaskEntity | null>;
    updateTask(id:string, data:TaskDTO) : Promise<TaskUpdateDTO | null>;
    updateTaskById(id:string, data:TaskUpdate) : Promise<TaskInfoDTO | null>;
    updateStageByTaskId(taskId:string, stage:StageDTO) : Promise<TaskUpdateDTO | null>;
    deleteTask(id:string) : Promise<any | null>;
    deleteTasksByPipelineId(pipelineId:string) : Promise<any | null>;

    getTotalTtasksCount() : Promise<number>;
    getTotalTaskByUserId(userId:string) : Promise<number>;
}