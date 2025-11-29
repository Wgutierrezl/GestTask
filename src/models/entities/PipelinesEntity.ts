import { EtapasDTO } from "../DTOs/PipelinesDTO"

export class PipelinesEntity{
    nombre!:string
    descripcion!: string
    estado!: string
    ownerId!: string
    etapas!: EtapasDTO[]
    fechaCreacion: Date=new Date();
}