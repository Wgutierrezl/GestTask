import { CommentsDTO } from "../../models/DTOs/CommentsDTO";
import { CommentsInfo } from "../../models/DTOs/CommentsInfo";

export interface ICommentsService{
    createComment(data:CommentsDTO) : Promise<CommentsInfo | null>;
    getAllCommentsByTaskId(id:string) : Promise<CommentsInfo[] | null>;
    updateCommentsById(id:string, data:CommentsDTO) : Promise<CommentsInfo | null>;
    getCommentById(id:string) : Promise<CommentsInfo | null>;
}