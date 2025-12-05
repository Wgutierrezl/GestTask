import { EtapasDTO } from "../DTOs/PipelinesDTO"

export class PipelinesEntity{
    nombre!:string
    descripcion!: string
    estado!: string
    tableroId!: string
    etapas!: EtapasDTO[]
    fechaCreacion: Date=new Date();
}