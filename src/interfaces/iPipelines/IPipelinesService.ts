import { pipelinesDTO } from "../../models/DTOs/PipelinesDTO";

export interface IPipelinesService{
    createPipelines(data:pipelinesDTO):Promise<pipelinesDTO | null>;
    getPipelinesById(id:string): Promise<pipelinesDTO | null>;
    getAllPipelines(): Promise<pipelinesDTO[] | null>; 
    getPipelinesByOwnerId(userId:string): Promise<pipelinesDTO[] | null>;
}