import { IPipelinesRepository } from "../interfaces/iPipelines/IPipelinesRepository";
import { pipelinesDTO } from "../models/DTOs/PipelinesDTO";
import { PipeUpdateDTO } from "../models/DTOs/PipeUpdateDTO";
import { Pipeline } from "../models/entities/Pipelines";
import { PipelinesEntity } from "../models/entities/PipelinesEntity";

export class PipelinesRepository implements IPipelinesRepository{
    
    async updatePipelines(data: PipeUpdateDTO): Promise<any> {
        return await Pipeline.findByIdAndUpdate(data._id, data , {new:true});
    }

    async createPipelines(data: PipelinesEntity): Promise<any> {
        const pipelines=new Pipeline(data);
        return await pipelines.save();
    }
    async getPipelinesById(id: string): Promise<any | null> {
        return await Pipeline.findById(id);
    }
    async getAllPipelines(): Promise<PipelinesEntity[] | null> {
        return await Pipeline.find();
    }
    async getPipelinesByOwnerId(userId: string): Promise<PipelinesEntity[] | null> {
        return await Pipeline.find({ownerId:userId});
    }
    
}