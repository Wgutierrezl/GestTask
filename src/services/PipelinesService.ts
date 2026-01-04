import { IPipelinesRepository } from "../interfaces/iPipelines/IPipelinesRepository";
import { IPipelinesService } from "../interfaces/iPipelines/IPipelinesService";
import { ITaskService } from "../interfaces/iTask/ITaskService";
import { pipelinesDTO, PipelinesInfoDTO } from "../models/DTOs/PipelinesDTO";
import { PipeUpdateDTO } from "../models/DTOs/PipeUpdateDTO";
import { PipelinesEntity } from "../models/entities/PipelinesEntity";

export class PipelinesService implements IPipelinesService{

    private readonly _repo:IPipelinesRepository;
    private readonly _taskService: ITaskService;

    constructor(repo:IPipelinesRepository, taskService: ITaskService){
        this._repo=repo;
        this._taskService=taskService;
    }

    // FOR COMMENT
    async getTotalPipelinesByBoardsId(boardsId: string[]): Promise<number> {
        const response=await this._repo.getTotalPipelinesByBoardsId(boardsId);
        console.log(`numero de pipelies creados en los tableros del usuario ${response}`);

        if(!response){
            throw new Error("No hemos logrado acceder a la cantidad de pipelines");
        }

        return response;
    }
    
    // FOR COMMENT
    async getTotalPipelinesCount(): Promise<number> {
        const data=await this._repo.getTotalPipelines();
        if(!data){
            throw new Error("no hemos logrado acceder a la cantidad de pipelines creados");
        }

        if(data===0){
            return 0;
        }

        return data;
    }

    async deletePipelinesById(id: string): Promise<any> {
        //first, we search for the pipeline
        const pipeline=await this._repo.getPipelinesById(id);
        if(pipeline==null || pipeline.length===0){
            return null;
        }

        //then, we get all tasks related to the pipeline
        const tasks=await this._taskService.getAllTaskByPipelineId(id);
        if(tasks && tasks.length>0){

            //then, we delete all tasks related to the pipeline
            const deletedTasks=await this._taskService.deleteTasksByPipelineId(id);
            if(!deletedTasks){
                throw new Error('no hemos logrado eliminar las tareas relacionadas al pipeline');
            }
        }

        //finally, we delete the pipeline
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
        pipe.tableroId=data.tableroId;
        
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
        pipeline.tableroId=data.tableroId;
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

    async getPipelinesByBoardId(boardId: string): Promise<PipelinesInfoDTO[]> {
        const pipelines = await this._repo.getPipelinesByBoardId(boardId);

        if (!pipelines || pipelines.length === 0) {
            return [];
        }

        return pipelines.map(pipe => {
            const dto = new PipelinesInfoDTO();

            dto.id = pipe._id.toString();
            dto.nombre = pipe.nombre;
            dto.descripcion = pipe.descripcion;
            dto.estado = pipe.estado;
            dto.tableroId = pipe.tableroId.toString?.() ?? pipe.tableroId;
            dto.etapas = pipe.etapas.map((etapa: any) => ({
                _id: etapa._id,
                nombre: etapa.nombre,
                orden: etapa.orden
            }));

            return dto;
        });
    }


    fillAttributesPipeline(data:any) : PipeUpdateDTO {
        return {
            _id:data._id,
            nombre:data.nombre,
            descripcion:data.descripcion,
            tableroId: data.tableroId,
            estado: data.estado,
            etapas: data.etapas ?? []
        };
    }

}