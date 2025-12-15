import mongoose from "mongoose";
import { IBUsersRepository } from "../interfaces/IBUsers/IBUsersRepository";
import { BUserInfoDTO } from "../models/DTOs/BUsersInfoDTO";
import { TableroUsuario } from "../models/entities/BoardsUsers";
import { BUsersEntity } from "../models/entities/BUsersEntity";

export class BUsersRepository implements IBUsersRepository{
    
    //METHOD TO GET BOARD_MEMBER BY USERID AND BOARD_ID
    async getBoardMemberByUserAndBoardId(userId: string, boardId: string): Promise<any> {
        return await TableroUsuario
            .findOne({
                usuarioId:userId,
                tableroId:boardId
            })
            .populate('usuarioId','_id nombre apellido correo rol');
    }

    //METHOD TO GET ALL MEMBER BY BOARD_ID
    async getBoardMemberByBoardId(boardId: string): Promise<any[]> {
        return await TableroUsuario
            .find({tableroId:boardId})
            .populate('usuarioId','_id nombre apellido correo rol');
    }

    //METHOD TO ADD MEMBER INTO THE BOARD
    async addMember(data: BUsersEntity): Promise<any> {
        const boardMember=new TableroUsuario(data);
        return await boardMember.save();
    }
    //METHOD GET ALL BOARD BY USERID
    async getBoardsByMemberId(userId: string): Promise<any[]> {
        return await TableroUsuario.find({usuarioId:userId});
    }

    //METHOD TO GET BOARD_MEMBER BY ID
    async getBoardUserById(id: string): Promise<any> {
        return await TableroUsuario.findById(id);
    }

    //METHOD TO UPDATE THE BOARD MEMBER BY ID
    async updateMemberById(data: any): Promise<any> {
        return await TableroUsuario.findByIdAndUpdate(data._id, data, {new:true});
    }

    //METHOD TO DELETE BOARD_MEMBER BY ID
    async deleteMemberBoard(id: string): Promise<any> {
        const result=await TableroUsuario.deleteOne({_id:new mongoose.Types.ObjectId(id)});
        return result.deletedCount>0;
        
    }
    
}