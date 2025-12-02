import { pipelinesDTO } from "../../models/DTOs/PipelinesDTO";
import { PipeUpdateDTO } from "../../models/DTOs/PipeUpdateDTO";

export interface IPipelinesService{
    createPipelines(data:pipelinesDTO):Promise<pipelinesDTO | null>;
    getPipelinesById(id:string): Promise<pipelinesDTO | null>;
    getAllPipelines(): Promise<pipelinesDTO[] | null>; 
    getPipelinesByOwnerId(userId:string): Promise<pipelinesDTO[] | null>;
    updatePipelines(id:string, data:pipelinesDTO) : Promise<PipeUpdateDTO | null>;
}