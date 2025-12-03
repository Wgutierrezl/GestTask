import { url } from "inspector";
import { IB2Service } from "../interfaces/IB2/IB2Service";
import { ICommentsRepository } from "../interfaces/IComments/ICommentsRepository";
import { ICommentsService } from "../interfaces/IComments/ICommentsService";
import { CommentsDTO, CreateCommentDTO } from "../models/DTOs/CommentsDTO";
import { CommentsInfo } from "../models/DTOs/CommentsInfo";
import { CommentsEntity } from "../models/entities/CommentsEntity";
import { B2Service } from "./B2Service";
import { SessionFileDTO } from "../models/DTOs/SessionFileDTO";

export class CommentService implements ICommentsService{

    private _repo:ICommentsRepository;
    private _b2: IB2Service;

    constructor(repo:ICommentsRepository, b2:IB2Service){
        this._repo=repo;
        this._b2=b2;
    }

    //METHOD TO DELETE COMMENT BY ID
    async deleteComment(id: string): Promise<boolean | null> {
        const response=await this._repo.getCommentById(id);
        if(!response){
            throw new Error('no existe el comentario que deseas borrar');
        }

        try{
            // 2. Eliminar archivos en Backblaze
            for(const file of response.archivos){
                console.log(`accediento a el nombre del archivo ${file.nombre}`);
                await this._b2.deleteFile(file.nombre);
                console.log('archivo eliminado hasta este momento');
            }
            
        }catch(error:any){
            console.error("Error eliminando archivos del comentario:", error);
            // Puedes decidir si lanzar el error o seguir eliminando el comentario en BD
            throw new Error("Error eliminando archivos del almacenamiento");

        }


        const deleteComment=await this._repo.deleteCommentById(response._id);
        console.log(`verificacion de eliminacion del comentario ${deleteComment}`);
        if(!deleteComment){
            throw new Error('no hemos logrado eliminar el comentario de la base de datos');
        }

        return deleteComment;

    }

    //METHOD TO GET AND URL ABOUT THE FILE THAT STAY IN THE BUCKET B2
    async downloadFile(commentId: string, fileId: string): Promise<SessionFileDTO | null> {
        const comment=await this._repo.getCommentById(commentId);
        console.log(`accediendo a los comentarios mediante el id ${commentId} object ${comment.data}`);
        if(!comment){
            throw new Error('No existe el comentario que deseas buscas');
        }

        const file=comment.archivos.find((a: { _id: { toString: () => string; }; })=> a._id.toString()==fileId.toString());

        if(!file){
            throw new Error('El archivo que tratas de buscar dentro de la tarea no se encuentra');
        }
        console.log(`archivo encontrado ${file.nombre} ; url ${file.url}`);

        const url=await this._b2.getUriFile(file.url);
        console.log(`esta es la url temporal ${url}`);

        return {
            userId:comment.usuarioId,
            url:url
        };

    }


    //METHOD TO CREATE A COMMENT AND INTEGRATION WITH B2 SERVICES : BACK BLAZE
    async createComment(data: CreateCommentDTO): Promise<CommentsInfo | null> {

        // 1. Validación básica
        if (!data.tareaId || !data.usuarioId || !data.mensaje) {
            throw new Error("Faltan datos requeridos");
        }

        const comment=new CommentsEntity();
        
        const finalFiles: any[]=[];

        // ────────────────────────────
            // 2. Validar si vienen archivos
        // ────────────────────────────
        if(data.archivos && data.archivos.length>0){

            try{
                console.log('empezamos a leer los archivos mandados');
                for(const archivo of data.archivos){

                if (!archivo.buffer || !archivo.originalName) {
                    continue; // ignora archivos inválidos
                }

                // Generar nombre único para Backblaze
                const nombreFinal = `${Date.now()}-${archivo.originalName}`;
                console.log(`nombre del archivo mandado ${nombreFinal}`);


                console.log('Empezamos a subir el archivo a lo que es el bucket de b2');
                const fileName=await this._b2.uploadFile(
                    archivo.buffer,
                    nombreFinal
                );

                console.log(`nombre del archivo generado dentro del bucket, guardamos solo la ruta ${fileName}`);

                //Montamos las url dadas y los nombres de los archivos
                finalFiles.push({
                    nombre: fileName,
                    url:fileName,
                    tamaño: archivo.size ? archivo.size.toString() :'0'
                });

                console.log(`ahora miramos como queda guardado dentro de la lista que nos guarda las rutas ${finalFiles}`);

            }

            console.log('Terminados el ciclo for que guardaba los archivos dentro de el bucket');
            console.log(`archivos generados al final ${finalFiles}`);

            }catch(error:any){
                console.log(`ha ocurrido un error inesperado ${error}`);
            }
            
        }

        
        //WE FILL THE REST ATTRIBUTES
        comment.tareaId=data.tareaId;
        comment.usuarioId=data.usuarioId;
        comment.mensaje=data.mensaje;
        comment.estado='activo';
        comment.fechaCreacion=new Date();
        comment.fechaEdicion=new Date();
        comment.archivos=finalFiles;

        const commentCreated=await this._repo.createComment(comment);
        if(commentCreated==null){
            throw new Error('No hemos logrado crear el commentario');
        }

        return this.fillComments(commentCreated);
    }


    //METHOD TO GET ALL COMMENTS BY TASK ID
    async getAllCommentsByTaskId(id: string): Promise<CommentsInfo[] | null> {
        const comment=await this._repo.getAllCommentsByTaskId(id);
        if(comment==null || comment.length==0){
            return null;
        }

        return comment;
    }


    updateCommentsById(id: string, data: CreateCommentDTO): Promise<CommentsInfo | null> {
        throw new Error("Method not implemented.");
    }

    //METHOD TO GET ONE COMMENT BY ID
    async getCommentById(id: string): Promise<CommentsInfo | null> {
        const comment=await this._repo.getCommentById(id);
        if(comment==null){
            return null;
        }

        return this.fillComments(comment);
    }


    //METHOD TO FILL THE OBJECT COMMENTSINFO
    private fillComments(data:any) : CommentsInfo {
        return {
            _id:data._id,
            tareaId: data.tareaId,
            usuarioId: data.usuarioId,
            mensaje: data.mensaje,
            archivos: data.archivos ?? [],
            estado: data.estado,
            fechaCreacion: data.fechaCreacion
        }
    }
    
}