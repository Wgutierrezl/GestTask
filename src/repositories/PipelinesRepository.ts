import mongoose from "mongoose";
import { IPipelinesRepository } from "../interfaces/iPipelines/IPipelinesRepository";
import { pipelinesDTO } from "../models/DTOs/PipelinesDTO";
import { PipeUpdateDTO } from "../models/DTOs/PipeUpdateDTO";
import { Pipeline } from "../models/entities/Pipelines";
import { PipelinesEntity } from "../models/entities/PipelinesEntity";

export class PipelinesRepository implements IPipelinesRepository{

    //METHOD TO GET COUNT BY ALL THE PIPELINES BY BOARDS ID ARRAY
    async getTotalPipelinesByBoardsId(boardsId: string[]): Promise<number> {
        return await Pipeline.countDocuments({
            tableroId:{
                $in: boardsId.map(id => new mongoose.Types.ObjectId(id))
            }
        });
        
    }
    
    //METHOD TO GET THE COUNT BY ALL THE PIPELINES CREATED
    async getTotalPipelines(): Promise<number> {
        return await Pipeline.countDocuments();
    }
    
    async deletePipelinesById(id: string): Promise<any> {
        const result=await Pipeline.deleteOne({_id:new mongoose.Types.ObjectId(id)});
        return result.deletedCount>0;
    }
    
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
    async getPipelinesByBoardId(boardId: string): Promise<any[] | null> {
        return await Pipeline.find({tableroId:boardId});
    }
    
}