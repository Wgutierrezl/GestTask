import { CommentsDTO, CreateCommentDTO } from "../../models/DTOs/CommentsDTO";
import { CommentsInfo } from "../../models/DTOs/CommentsInfo";
import { SessionFileDTO } from "../../models/DTOs/SessionFileDTO";

export interface ICommentsService{
    createComment(data:CreateCommentDTO) : Promise<CommentsInfo | null>;
    getAllCommentsByTaskId(id:string) : Promise<CommentsInfo[] | null>;
    updateCommentsById(id:string, data:CreateCommentDTO) : Promise<CommentsInfo | null>;
    getCommentById(id:string) : Promise<CommentsInfo | null>;
    downloadFile(commentId:string, fileId:string) : Promise<SessionFileDTO | null>;
}