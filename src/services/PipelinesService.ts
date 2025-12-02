import { IPipelinesRepository } from "../interfaces/iPipelines/IPipelinesRepository";
import { IPipelinesService } from "../interfaces/iPipelines/IPipelinesService";
import { pipelinesDTO } from "../models/DTOs/PipelinesDTO";
import { PipeUpdateDTO } from "../models/DTOs/PipeUpdateDTO";
import { PipelinesEntity } from "../models/entities/PipelinesEntity";

export class PipelinesService implements IPipelinesService{

    private readonly _repo:IPipelinesRepository;

    constructor(repo:IPipelinesRepository){
        this._repo=repo;
    }

    async deletePipelinesById(id: string): Promise<any> {
        const pipeline=await this._repo.getPipelinesById(id);
        if(pipeline==null){
            return null;
        }

        const deleted=await this._repo.deletePipelinesById(id);
        if(!deleted){
            throw new Error('no hemos logrado eliminar el pipeline');
        }

        return deleted;


    }

    
    async updatePipelines(id: string, data: pipelinesDTO): Promise<PipeUpdateDTO | null> {
        let pipe=await this._repo.getPipelinesById(id);
        if(pipe==null){
            throw new Error('no encontramos el pipeline que tratas de actualizar');
        }

        pipe.nombre=data.nombre;
        pipe.descripcion=data.descripcion;
        pipe.estado=data.estado;
        pipe.ownerId=data.ownerId;
        
        if(data.etapas && data.etapas.length>0){
            pipe.etapas=data.etapas;
        }

        const pipelineUpdated=await this._repo.updatePipelines(pipe);
        if(pipelineUpdated==null){
            throw new Error('no hemos logrado actualizar el pipeline');
        }

        return this.fillAttributesPipeline(pipelineUpdated);

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


    fillAttributesPipeline(data:any) : PipeUpdateDTO {
        return {
            _id:data._id,
            nombre:data.nombre,
            descripcion:data.descripcion,
            ownerId: data.ownerId,
            estado: data.estado,
            etapas: data.etapas ?? []
        };
    }

}