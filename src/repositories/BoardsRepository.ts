import { IBoardRepository } from "../interfaces/IBoard/IBoardRepository";
import { BoardUpdateDTO } from "../models/DTOs/BoardUpdateDTO";
import { Board } from "../models/entities/Boards";
import { BoardEntity } from "../models/entities/BoardsEntity";
import mongoose from "mongoose";
import { TableroUsuario } from "../models/entities/BoardsUsers";

export class BoardRepository implements IBoardRepository{

    //METHOD TO GET THE COUNT OF THE BOARDS
    async getTotalBoards(): Promise<number> {
        return await Board.countDocuments();
    }

    //METHOD TO GET ALL BOARDS THAT THE USER BELONGS
    async getBoardsByUserId(userId: string): Promise<any[]> {

        
        //WE SEARCH ALL THE BOARDS WHERE THE USER IS OWNER
        const ownerBoards=await Board.find({ownerId:userId});

        //WE SEARCH ALL THE BOARDS MEMBER BY THE USER ID
        const relations=await TableroUsuario.find({usuarioId:userId});

        //WE SELECT ALL THE BOARDS WHERE THE USER ROLE IS DIFFERENT BY OWNER
        /* const membersBoards=relations
                            .filter(r=> r.rol!=='owner')
                            .map(r=> r.tableroId); */


        //WE SELECT THE IDS BY BOARDS
        const boardsId=relations.map(r=> r.tableroId);


        //WE SELECT ALL THE BOARDS BY BETWEEN THE BOARD ID
        const memberBoards=await Board.find({
            _id:{$in : boardsId}
        });

        //UNION BOARDS WITH REPETS
        const boardMap=new Map<string,any>();


        [...ownerBoards,...memberBoards].forEach(board=> {
            boardMap.set(board._id.toString(), board);
        });

        return Array.from(boardMap.values());

    }
    
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