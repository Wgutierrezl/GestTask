import { ICommentsRepository } from "../interfaces/IComments/ICommentsRepository";
import { CommentUpdateDTO } from "../models/DTOs/CommentUpdateDTO";
import { Comments } from "../models/entities/Comments";
import { CommentsEntity } from "../models/entities/CommentsEntity";
import mongoose from "mongoose";

export class CommentsRepository implements ICommentsRepository{

    //METHOD TO GET QUANTITY BY USER ID
    async getTotalCommentsByUserId(userId: string): Promise<number> {
        return await Comments.countDocuments({
            usuarioId:userId
        });
    }

    //METHOD TO GET ALL THE COUNT BY COMMENTS
    async getTotalComments(): Promise<number> {
        return await Comments.countDocuments();
    }

    //METHOD TO GET COMMENTS BY TASK IDS - FOR CASCADE DELETE
    async getCommentsByTaskId(tasksId: string[]): Promise<any[]> {
        return await Comments.find({tareaId: { $in: tasksId }});
    }

    //METHOD TO DELETE COMMENTS BY TASK ID - CASCADE DELETE
    async deleteCommentsByTaskIdCascade(taskId: string[]): Promise<any> {
        return await Comments.deleteMany({tareaId: { $in: taskId }});
    }


    //-------------------------------------------------------------------------------//


    //METHOD TO GET MY COMMENTS BY TASK ID
    async getMyCommentsByTaskId(id: string, userId: string): Promise<any[]> {
        return await Comments
            .find({
                usuarioId:userId,
                tareaId:id
            });
    }

    //METHOD TO DELETE A COMMENT BY ID
    async deleteCommentById(id: string): Promise<any> {
        const result=await Comments.deleteOne({_id:new mongoose.Types.ObjectId(id)});
        return result.deletedCount>0;   
    }

    //METHOD TO CREATE A NEW COMMENT
    async createComment(data: CommentsEntity): Promise<any> {
        const comment=new Comments(data);
        return await comment.save();
    }

    //METHOD TO GET ALL COMMENTS BY TASK ID
    async getAllCommentsByTaskId(id: string): Promise<any[]> {
        return await Comments.find({tareaId:id})
                             .populate('usuarioId','_id nombre apellido correo rol');
    }

    //METHOD TO UODATE TASK BY ID AND DATA
    async updateCommentsById(data: CommentUpdateDTO): Promise<any> {
        return await Comments.findByIdAndUpdate(data._id, data, {new:true});
    }

    //METHOD TO GET TASK BY ID
    async getCommentById(id: string): Promise<any> {
        return await Comments.findById(id);
    }

    
}