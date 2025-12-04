import { CommentsDTO, FileInputDTO } from "./CommentsDTO";

export class CommentUpdateDTO extends CommentsDTO{
    _id!:string;
}


export class UpdateCommentFileDTO{
    mensaje?: string;
    archivosEliminar?:[]
    archivosCargados?: FileInputDTO[]
}