import { Request,Response } from "express";
import { IPipelinesService } from "../interfaces/iPipelines/IPipelinesService";
import { PipelinesRepository } from "../repositories/PipelinesRepository";
import { PipelinesService } from "../services/PipelinesService";
import { pipelinesDTO } from "../models/DTOs/PipelinesDTO";

export class PipelineController{

    private readonly _service:IPipelinesService;

    constructor(){
        const pipe=new PipelinesRepository();

        this._service=new PipelinesService(pipe);
    }


    createPipelines=async(req:Request, res:Response): Promise<Response> =>{
        try{
            const dto:pipelinesDTO=req.body;
            const pipeCreated=await this._service.createPipelines(dto);
            if(pipeCreated==null){
                return res.status(400).json({message:"No hemos creado el pipelines"});
            }

            return res.status(201).json(pipeCreated);

        }catch(error:any){
            console.error(error);
            return res.status(500).json({ message: "Error al crear el pipeline" });
        }
    }


    getAllPipelines=async(req:Request, res:Response): Promise<Response> => {
        try{
            const response=await this._service.getAllPipelines();
            if(response==null){
                return res.status(400).json({message:"Aun no hay pipelines"});
            }

            return res.status(200).json(response);

        }catch(error:any){
            console.error(error);
            return res.status(500).json({ message: "Aun no hay pipelines" });

        }

    }

    getPipelineById=async(req:Request, res:Response): Promise<Response> => {
        try{

            const {id}=req.params;

            if (!id) {
                return res.status(400).json({ message: "Debes incluir el id" });
            }
            
            const response=await this._service.getPipelinesById(id);
            if(response==null){
                return res.status(404).json({message:"pipeline not found"});
            }

            return res.status(200).json(response);

        }catch(error:any){
            console.error(error);
            return res.status(500).json({ message: "Aun no hay pipelines" });
        }
    }


    getPipelineByOwnerId=async(req:Request, res:Response): Promise<Response> => {
        try{
            const {userId}=req.params;
            if(!userId){
                return res.status(400).json({ message: "Debes incluir el id del propietario"});
            }

            const pipelines=await this._service.getPipelinesByOwnerId(userId);
            if(pipelines==null){
                return res.status(404).json({message:"Aun no tienes pipelines creados"});
            }

            return res.status(200).json(pipelines);

        }catch(error:any){
            console.error(error);
            return res.status(500).json({ message: "Aun no hay pipelines" });
        }
    }

    updatePipeline=async(req:Request, res:Response) : Promise<Response> => {
        try{
            const {id}=req.params;
            const dto:pipelinesDTO=req.body;

            if(!id){
                return res.status(400).json({message:'debes de diligenciar el id'});
            }

            if(!dto){
                return res.status(400).json({message:'debes de diligenciar el objeto'});
            }

            const response=await this._service.updatePipelines(id,dto);
            if(response==null){
                return res.status(400).json({message:'no hemos logrado actualizar el pipeline'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            console.error(error);
            return res.status(500).json({ message: `ha ocurrido un error inesperado ${error}` });
        }
    }
}