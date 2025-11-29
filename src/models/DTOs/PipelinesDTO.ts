export class EtapasDTO{
    nombre!:string
    orden!:number
}

export class pipelinesDTO{
    nombre!:string
    descripcion!: string
    estado!: string
    ownerId!: string
    etapas!: EtapasDTO[]
}

