import { CommentsDTO } from "../DTOs/CommentsDTO";

export class CommentsEntity extends CommentsDTO{
    estado?: string;
    fechaCreacion?: Date;
    fechaEdicion?: Date;
}