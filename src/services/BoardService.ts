import { error } from "node:console";
import { IBoardRepository } from "../interfaces/IBoard/IBoardRepository";
import { IBoardService } from "../interfaces/IBoard/IBoardService";
import { BoardDTO } from "../models/DTOs/BoardDTO";
import { BoardInfoDTO } from "../models/DTOs/BoardInfoDTO";
import { BoardEntity } from "../models/entities/BoardsEntity";
import { BoardUpdateDTO } from "../models/DTOs/BoardUpdateDTO";
import { IBUsersService } from "../interfaces/IBUsers/IBUsersService";
import { BoardsUsersDTO } from "../models/DTOs/BoardsUsersDTO";

export class BoardService implements IBoardService{

    private readonly _repo:IBoardRepository
    private readonly _boardMember: IBUsersService;

    constructor(repo:IBoardRepository, boardMember:IBUsersService){
        this._repo=repo;
        this._boardMember=boardMember;
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
        console.log(`tablero creado ${boardCreated}`);


        console.log('desde aqui se empezara a crear dentro de tablero_usuarios el miembro propietario');

        await this.fillObjectBoardMemberOwner(boardCreated);

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


    private async fillObjectBoardMemberOwner(data:any) : Promise<void> {
        try{
            const board=new BoardsUsersDTO();

            board.usuarioId=data.ownerId;
            board.tableroId=data._id;
            board.rol='owner';

            console.log(`Se creara dentro de la tablero_usuarios el propietario del tabler con id ${data.ownerId}`);


            const memberCreated=await this._boardMember.addMember(board);
            console.log(`miembro creado correctamente como propietario del tablero con id ${memberCreated.usuarioId}`);

            console.log(`miembro creado : ${memberCreated}`);

        }catch(error:any){
            console.log(`ha ocurrido un error inesperado ${error.message || error}`);
        }
        

    }
    
}