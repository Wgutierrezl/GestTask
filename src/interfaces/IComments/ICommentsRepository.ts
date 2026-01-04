import { CommentUpdateDTO } from "../../models/DTOs/CommentUpdateDTO";
import { CommentsEntity } from "../../models/entities/CommentsEntity";

export interface ICommentsRepository{
    createComment(data:CommentsEntity) : Promise<any>;
    getAllCommentsByTaskId(id:string) : Promise<any[]>;
    getMyCommentsByTaskId(id:string, userId: string) : Promise<any[]>;
    updateCommentsById(data:CommentUpdateDTO) : Promise<any>;
    getCommentById(id:string) : Promise<any>;
    deleteCommentById(id:string) : Promise<any>;

    //METHOD TO DELETE COMMENTS BY TASK ID - CASCADE DELETE
    deleteCommentsByTaskIdCascade(taskId:string[]) : Promise<any>;
    getCommentsByTaskId(tasksId:string[]) : Promise<any[]>;

    getTotalComments() : Promise<number>;
}