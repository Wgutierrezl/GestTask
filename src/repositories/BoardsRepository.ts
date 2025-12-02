import { IBoardRepository } from "../interfaces/IBoard/IBoardRepository";
import { BoardUpdateDTO } from "../models/DTOs/BoardUpdateDTO";
import { Board } from "../models/entities/Boards";
import { BoardEntity } from "../models/entities/BoardsEntity";
import mongoose from "mongoose";

export class BoardRepository implements IBoardRepository{
    
    async deleteBoardById(id: string): Promise<any> {
        const result=await Board.deleteOne({_id:new mongoose.Types.ObjectId(id)});
        return result.deletedCount>0;
    }

    async createBoard(data: BoardEntity): Promise<any> {
        const board=new Board(data);
        return await board.save();
    }
    async getBoardsByOnwerId(userId: string): Promise<any[]> {
        return await Board.find({ownerId:userId});
    }
    async getBoardById(id: string): Promise<any | null> {
        return await Board.findById(id);
    }
    async updateBoards(data: BoardUpdateDTO): Promise<any> {
        return await Board.findByIdAndUpdate(data._id, data, {new:true});
    }
    
}