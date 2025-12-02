export class TaskUpdateDTO{
    _id!:string
    titulo?:string
    descripcion?: string
    pipelineId?: string
    etapaId?: string
    asignadoA?: string
    priodidad?: string
    fechaLimite?: Date
    fechaFinalizacion?: Date;
}