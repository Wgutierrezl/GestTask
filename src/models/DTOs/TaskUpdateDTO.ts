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


export class TaskUpdate{
    titulo?:string
    descripcion?: string
    asignadoA?: string
    priodidad?: string
    fechaLimite?: Date
    fechaFinalizacion?: Date;
}

export class TaskInfoDTO{
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