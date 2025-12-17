export class EtapasDTO{
    nombre!:string
    orden!:number
}

export class pipelinesDTO{
    nombre!:string
    descripcion!: string
    estado!: string
    tableroId!: string
    etapas!: EtapasDTO[]
}

export class PipelinesInfoDTO extends pipelinesDTO{
    id!:string;
}

