import { pipelinesDTO } from "../../models/DTOs/PipelinesDTO";
import { PipeUpdateDTO } from "../../models/DTOs/PipeUpdateDTO";
import { PipelinesEntity } from "../../models/entities/PipelinesEntity";

export interface IPipelinesRepository{
    createPipelines(data:PipelinesEntity): Promise<any>;
    getPipelinesById(id:string): Promise<any | null>;
    getAllPipelines(): Promise<PipelinesEntity[] | null>; 
    getPipelinesByBoardId(boardId:string): Promise<any[] | null>;
    updatePipelines(data:PipeUpdateDTO) : Promise<any>;
    deletePipelinesById(id:string) : Promise<any>;

    getTotalPipelines() : Promise<number>;
    getTotalPipelinesByBoardsId(boardsId:string[]) : Promise<number>;
    getTotalPipelinesIdByBoardsId(boardsId:string[]) : Promise<any[]>;
}