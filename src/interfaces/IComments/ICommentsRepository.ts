import { CommentUpdateDTO } from "../../models/DTOs/CommentUpdateDTO";
import { CommentsEntity } from "../../models/entities/CommentsEntity";

export interface ICommentsRepository{
    createComment(data:CommentsEntity) : Promise<any>;
    getAllCommentsByTaskId(id:string) : Promise<any[]>;
    updateCommentsById(data:CommentUpdateDTO) : Promise<any>;
    getCommentById(id:string) : Promise<any>;
    deleteCommentById(id:string) : Promise<any>;
}