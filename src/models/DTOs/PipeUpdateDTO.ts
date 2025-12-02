import { EtapasDTO } from "./PipelinesDTO"

export class PipeUpdateDTO{
    _id!:string
    nombre?:string
    descripcion?: string
    ownerId!: string
    estado?: string
    etapas?: EtapasDTO[]
}