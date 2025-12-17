import { pipelinesDTO, PipelinesInfoDTO } from "../../models/DTOs/PipelinesDTO";
import { PipeUpdateDTO } from "../../models/DTOs/PipeUpdateDTO";

export interface IPipelinesService{
    createPipelines(data:pipelinesDTO):Promise<pipelinesDTO | null>;
    getPipelinesById(id:string): Promise<pipelinesDTO | null>;
    getAllPipelines(): Promise<pipelinesDTO[] | null>; 
    getPipelinesByBoardId(boardId:string): Promise<PipelinesInfoDTO[] | null>;
    updatePipelines(id:string, data:pipelinesDTO) : Promise<PipeUpdateDTO | null>;
    deletePipelinesById(id:string) : Promise<any>;
}