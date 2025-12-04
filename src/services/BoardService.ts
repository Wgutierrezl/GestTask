import { error } from "node:console";
import { IBoardRepository } from "../interfaces/IBoard/IBoardRepository";
import { IBoardService } from "../interfaces/IBoard/IBoardService";
import { BoardDTO } from "../models/DTOs/BoardDTO";
import { BoardInfoDTO } from "../models/DTOs/BoardInfoDTO";
import { BoardEntity } from "../models/entities/BoardsEntity";
import { BoardUpdateDTO } from "../models/DTOs/BoardUpdateDTO";

export class BoardService implements IBoardService{

    private readonly _repo:IBoardRepository

    constructor(repo:IBoardRepository){
        this._repo=repo;
    }
    
    async deleteBoardById(id: string): Promise<any | null> {
        const board=await this._repo.getBoardById(id);
        if(board==null){
            return null;
        }

        const boardDeleted=await this._repo.deleteBoardById(id);
        if(!boardDeleted){
            throw new Error('no hemos logrado borrar el tablero');
        }

        return boardDeleted;
    }


    async createBoard(data: BoardDTO): Promise<BoardInfoDTO | null> {
        const board=new BoardEntity();

        board.nombre=data.nombre;
        board.descripcion=data.descripcion;
        board.ownerId=data.ownerId;

        /* if(data.miembros && data.miembros.length>0){
            board.miembros=data.miembros;

        } */

        if(data.pipelines && data.pipelines.length>0){
            board.pipelines=data.pipelines;
        }

        board.fechaCreacion=new Date();
        board.estado='activo';

        const boardCreated=await this._repo.createBoard(board);
        console.log(boardCreated);

        if(boardCreated==null){
            throw new Error("no hemos logrado crear ek board");
        }

        return  {
            _id:boardCreated._id,
            nombre: boardCreated.nombre,
            descripcion : boardCreated.descripcion,
            ownerId: boardCreated.ownerId,
            /* miembros: boardCreated.miembros ?? [], */
            pipelines: boardCreated.pipelines ?? [],
        };
    }


    async getAllBoardByOnwnerId(userId: string): Promise<BoardInfoDTO[] | null> {
        const boards=await this._repo.getBoardsByOnwerId(userId);
        console.log(boards);
        if(!boards || boards.length==0){
            return null;

        }

        return boards;


    }


    async getBoardById(id: string): Promise<BoardInfoDTO | null> {
        const board=await this._repo.getBoardById(id);
        console.log(board);
        if(board==null){
            return null;
        }

        return this.fillObjectBoard(board);
    }


    async updateBoard(id: string, data: BoardDTO): Promise<BoardInfoDTO | null> {
        let board:BoardUpdateDTO=await this._repo.getBoardById(id);
        if(board==null){
            return null;
        }

        if(data.nombre!==undefined){
            board.nombre=data.nombre;
        }
        

        if(data.descripcion!==undefined){
            board.descripcion=data.descripcion;
        }
        
        
        /* if(data.miembros !== undefined){
            board.miembros=data.miembros;
        } */

        if(data.pipelines !== undefined){
            board.pipelines=data.pipelines;
        }

        board._id=id;

        const boardUpdated=await this._repo.updateBoards(board);
        console.log(boardUpdated);
        
        if(boardUpdated==null){
            throw new Error("No hemos logrado actualizar el tablero");
        }

        return this.fillObjectBoard(boardUpdated);

    }



    fillObjectBoard(data:any) : BoardInfoDTO {
        return  {
            _id:data._id,
            nombre: data.nombre,
            descripcion : data.descripcion,
            ownerId: data.ownerId,
            /* miembros: data.miembros ?? [], */
            pipelines: data.pipelines ?? [],
        };
    }
    
}