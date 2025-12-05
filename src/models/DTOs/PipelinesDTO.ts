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

