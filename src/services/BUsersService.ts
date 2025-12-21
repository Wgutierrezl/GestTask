import { IBUsersRepository } from "../interfaces/IBUsers/IBUsersRepository";
import { IBUsersService } from "../interfaces/IBUsers/IBUsersService";
import { BoardsUsersDTO } from "../models/DTOs/BoardsUsersDTO";
import { BUserInfoDTO } from "../models/DTOs/BUsersInfoDTO";
import { BUsersEntity } from "../models/entities/BUsersEntity";

export class BUsersService implements IBUsersService{

    private readonly _repo:IBUsersRepository;

    constructor(repo:IBUsersRepository){
        this._repo=repo;

    }

    //METHOD TO DELETE MEMBERS BY BOARDID
    async deleteMembersByBoardId(boardId: string): Promise<any | null> {
        const members=await this._repo.getBoardMemberByBoardId(boardId);
        if(!members || members.length===0){
            return null;
        }

        const membersDeleted=await this._repo.deleteMembersBoardByBoardId(boardId);

        if(!membersDeleted){
            return false;
        }

        return membersDeleted;

    }

    //METHOD TO GET BOARD_MEMBER BY USER ID AND BOARD ID
    async getBoardMemberByUserAndBoardId(userId: string, boardId: string): Promise<any> {
        const member=await this._repo.getBoardMemberByUserAndBoardId(userId, boardId);
        if(!member || member.length===0){
            return null;
        }

        return member;
    }

    //METHOD TO GEL ALL MEMBER BY BOARD ID
    async getBoardMemberByBoardId(boardId: string): Promise<any[] | null> {
        const member=await this._repo.getBoardMemberByBoardId(boardId);
        if(!member || member.length===0){
            return null;
        }

        return member;
    }

    //METHOD TO ADD A NEW MEMBER INTO THE BOARD
    async addMember(data: BoardsUsersDTO): Promise<any | null> {
        const member=new BUsersEntity();


        member.usuarioId=data.usuarioId;
        member.tableroId=data.tableroId;
        member.rol=data.rol;

        const memberCreated=await this._repo.addMember(member);
        console.log(`miembro del tablero creado ${memberCreated}`);

        if(!memberCreated){
            return null;
        }

        return this.fillObjectBoardMemer(memberCreated);
    }

    //METHOD TO GET ALL BOARD BY USER ID
    async getBoardsByMemberId(userId: string): Promise<any[] | null> {
        const boardMember=await this._repo.getBoardsByMemberId(userId);
        console.log(`tableros a los cuales pertenece el usuario ${userId}`);
        console.log(`tableros : ${boardMember}`);

        if(!boardMember || boardMember.length===0){
            return null;
        }

        return boardMember;
    }

    //METHOD TO GET BOARD MEMBER BY ID
    async getBoardUserById(id: string): Promise<any | null> {
        const boardMember=await this._repo.getBoardUserById(id);
        console.log(`tablero buscado por id ${id} : tablero ${boardMember}`);
        if(boardMember==null){
            return null;
        }

        return this.fillObjectBoardMemer(boardMember);
    }

    //METHOD TO UPDATE A BOARD MEMBER BY ID 
    async updateMemberById(id:string, data: BoardsUsersDTO): Promise<any> {
        const boardMember=await this._repo.getBoardUserById(id);
        console.log(`tablero encontrado ${boardMember}`);
        if(boardMember==null){
            return null;
        }

        if(data.rol){
            boardMember.rol=data.rol
        }

        if(data.tableroId){
            boardMember.tableroId=data.tableroId
        }

        if(data.usuarioId){
            boardMember.usuarioId=data.usuarioId;
        }

        boardMember._id=id


        const boardUpdated=await this._repo.updateMemberById(boardMember);

        console.log(`tablero actualizado ${boardUpdated}`);

        if(!boardUpdated){
            throw new Error('No hemos logrado actualizar la informacion del tablero');
        }

        return this.fillObjectBoardMemer(boardUpdated);


        
    }

    //METHOD TO DELETE A BOARD BY ID
    async deleteMemberBoard(id: string): Promise<any> {
        const deletedMember=await this._repo.deleteMemberBoard(id);
        console.log(`tablero eliminado correctamente : ${deletedMember}`);
        if(!deletedMember){
            return false;
        }

        return deletedMember;
    }


    private fillObjectBoardMemer(data:any) : BUserInfoDTO {
        return {
            _id:data._id,
            tableroId:data.tableroId,
            usuarioId:data.usuarioId,
            rol:data.rol,
            fechaIngreso:data.fechaIngreso
        }
    }
    
}