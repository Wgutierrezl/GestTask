import { EtapasDTO } from "./PipelinesDTO"

export class PipeUpdateDTO{
    _id!:string
    nombre?:string
    descripcion?: string
    tableroId!: string
    estado?: string
    etapas?: EtapasDTO[]
}