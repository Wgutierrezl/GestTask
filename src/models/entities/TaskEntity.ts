export class TaskEntity{
    titulo!:string
    descripcion!: string
    pipelineId!: string
    etapaId!: string
    asignadoA!: string
    estado!:string;
    priodidad!: string
    fechaCreacion:Date=new Date()
    fechaLimite!: Date
    fechaFinalizacion?: Date;
    tableroId!:string
}