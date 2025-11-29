import { IPipelinesRepository } from "../interfaces/iPipelines/IPipelinesRepository";
import { IPipelinesService } from "../interfaces/iPipelines/IPipelinesService";
import { pipelinesDTO } from "../models/DTOs/PipelinesDTO";
import { PipelinesEntity } from "../models/entities/PipelinesEntity";

export class PipelinesService implements IPipelinesService{

    private readonly _repo:IPipelinesRepository;

    constructor(repo:IPipelinesRepository){
        this._repo=repo;
    }


    async createPipelines(data: pipelinesDTO): Promise<pipelinesDTO | null> {
        const pipeline=new PipelinesEntity();

        pipeline.nombre=data.nombre;
        pipeline.descripcion=data.descripcion;
        pipeline.estado=data.estado;
        pipeline.etapas=data.etapas;
        pipeline.ownerId=data.ownerId;
        pipeline.fechaCreacion = new Date();


        const pipelineCreated=await this._repo.createPipelines(pipeline);
        console.log(pipelineCreated);
        if(pipeline==null){
            return null;
        }

        return pipelineCreated;
    }

    async getPipelinesById(id: string): Promise<pipelinesDTO | null> {
        const response=await this._repo.getPipelinesById(id);
        if(response==null){
            return null
        }

        return response;
    }


    async getAllPipelines(): Promise<pipelinesDTO[] | null> {
        const response=await this._repo.getAllPipelines();
        if(response?.length===0 || response==null){
            return null;
        }

        return response;
    }

    async getPipelinesByOwnerId(userId: string): Promise<pipelinesDTO[] | null> {
        const response=await this._repo.getPipelinesByOwnerId(userId);
        if(response?.length===0 || response==null){
            return null;
        }

        return response;
    }

}