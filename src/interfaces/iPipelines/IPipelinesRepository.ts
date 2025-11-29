import { pipelinesDTO } from "../../models/DTOs/PipelinesDTO";
import { PipelinesEntity } from "../../models/entities/PipelinesEntity";

export interface IPipelinesRepository{
    createPipelines(data:PipelinesEntity): Promise<any>;
    getPipelinesById(id:string): Promise<PipelinesEntity | null>;
    getAllPipelines(): Promise<PipelinesEntity[] | null>; 
    getPipelinesByOwnerId(userId:string): Promise<PipelinesEntity[] | null>;
}