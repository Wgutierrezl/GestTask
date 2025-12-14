export class BoardMemberInfoDTO{
    tableroId!: string;
    usuarioId!:{
        _id:string;
        nombre:string;
        apellido:string;
        email:string;
    }
    rol!: string;
}