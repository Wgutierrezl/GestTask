import { url } from "inspector";
import { IB2Service } from "../interfaces/IB2/IB2Service";
import { ICommentsRepository } from "../interfaces/IComments/ICommentsRepository";
import { ICommentsService } from "../interfaces/IComments/ICommentsService";
import { CommentsDTO, CreateCommentDTO, FileInputDTO } from "../models/DTOs/CommentsDTO";
import { CommentsInfo } from "../models/DTOs/CommentsInfo";
import { CommentsEntity } from "../models/entities/CommentsEntity";
import { B2Service } from "./B2Service";
import { SessionFileDTO } from "../models/DTOs/SessionFileDTO";
import { CommentUpdateDTO, UpdateCommentFileDTO } from "../models/DTOs/CommentUpdateDTO";

export class CommentService implements ICommentsService{

    private _repo:ICommentsRepository;
    private _b2: IB2Service;

    constructor(repo:ICommentsRepository, b2:IB2Service){
        this._repo=repo;
        this._b2=b2;
    }

    //METHOD TO GET ALL COUNT BY COMMENTS
    async getTotalCommentsCount(): Promise<number> {
        const data=await  this._repo.getTotalComments();
        console.log(`total de comentarios obtenidos ${data}`);

        if(!data){
            throw new Error("no hemos logrado obtener la cantidad de comentarios");
        }

        if(data===0){
            return 0;
        }

        return data;
    }

    //METHOD TO GET COMMENTS BY TASK IDS
    async getCommentsByTaskId(tasksId: string[]): Promise<any[]> {
        const response=await this._repo.getCommentsByTaskId(tasksId);
        if(!response || response.length===0){
            return [];
        }
        return response;
    }

    //METHOD TO DELETE COMMENTS BY TASK ID
    async deleteCommentsByTaskId(taskId: string[]): Promise<boolean | null> {
        try{

            //FIRST, WE GET SEARCH ALL COMMENTS FILES BY THE ARRAY OF TASK IDS
            const commentsFiles=await this._repo.getCommentsByTaskId(taskId);
            if(commentsFiles && commentsFiles.length>0){
                for(const comment of commentsFiles){
                    for(const file of comment.archivos){
                        console.log(`accediento a el nombre del archivo ${file.nombre}`);
                        await this._b2.deleteFile(file.nombre);
                        console.log('archivo eliminado hasta este momento');
                    }
                }
            }

            //NOW WE PROCEED TO DELETE THE COMMENTS BY THE ARRAY OF TASK IDS
            const commentsDeleted=await this._repo.deleteCommentsByTaskIdCascade(taskId);
            console.log(`verificacion de eliminacion de los comentarios ${commentsDeleted}`);
            if(commentsDeleted.deletedCount===0){
                return false;
            }
            return true;
        }catch(error:any){
            console.log(`ha ocurrido un error inesperado ${error}`);
            throw new Error(`ha ocurrido un error inesperado ${error}`);
        }
    }

    //METHOD TO GET ALL MY COMMENTS BY TASK ID
    async getMyCommentsByTaskId(id: string, userId: string): Promise<CommentsInfo[] | null> {
        const response=await this._repo.getMyCommentsByTaskId(id, userId);
        if(!response || response.length===0){
            return null;
        }

        return response;
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
    async createComment(data: CreateCommentDTO, userId:string): Promise<CommentsInfo | null> {

        // 1. Validación básica
        if (!data.tareaId || !data.mensaje) {
            throw new Error("Faltan datos requeridos");
        }

        const comment=new CommentsEntity();
        
        let finalFiles: any[]=[];

        // 2. Subir archivos a Backblaze B2 si existen

        finalFiles=await this.uploadNewFileIntoB2ByUpdate(finalFiles, data.archivos ?? []);

        
        //WE FILL THE REST ATTRIBUTES
        comment.tareaId=data.tareaId;
        comment.usuarioId=userId;
        comment.mensaje=data.mensaje;
        comment.estado='activo';
        comment.fechaCreacion=new Date();
        comment.fechaEdicion=new Date();
        comment.archivos=finalFiles ?? [];

        const commentCreated=await this._repo.createComment(comment);
        if(commentCreated==null){
            throw new Error('No hemos logrado crear el commentario');
        }

        return this.fillComments(commentCreated);
    }


    //METHOD TO GET ALL COMMENTS BY TASK ID
    async getAllCommentsByTaskId(id: string): Promise<CommentsInfo[] | null> {
        const comment=await this._repo.getAllCommentsByTaskId(id);
        console.log(`comentarios encontrados`,comment)
        if(comment==null || comment.length==0){
            return null;
        }

        return comment;
    }


    //METHOD TO UPDATE THE COMMENT BY ID
    async updateCommentsById(id: string, data: UpdateCommentFileDTO): Promise<CommentsInfo | null> {
        const comment=await this._repo.getCommentById(id);

        if(comment==null){
            return null;
        }


        //WE CHANGE THE MESSAGE BEACUSE IS THE EASIEST ATTRIBUTE TO CHANGE
        if(data.mensaje!==undefined){
            comment.mensaje=data.mensaje;
        }
        

        const commentUpdated=new CommentUpdateDTO();

        //WE ASK IF THE USER SEND FILES OR THE ID THE FILE ID
        /* if(data.archivosEliminar && data.archivosEliminar?.length>0){
            //RUN THE FOR CICLE BY FIND THE FILEID TO DELETE
            for(const fileId of data.archivosEliminar){

                //SEARCH THE FILEID INTO THE COMMENTS.ARCHIVOS
                const fileFound=comment.archivos.find((a: { _id: { toString: () => string; }; })=> a._id.toString()===fileId);
                if(!fileFound){
                    console.log(`el archivo con id ${fileId} no se encuentra dentro del comentario`);
                }

                try{

                    console.log(`eliminaremos el archivo con nombre ${fileFound.nombre}`);

                    //DELETE THE FILE INTO THE BUCKET OF B2
                    await this._b2.deleteFile(fileFound.nombre);
                    console.log('archivo eliminado correctamente');

                    //DELETE THE FILE INTO THE ARRAY OF THE COMMENT ARCHIVOS
                    console.log('procederemos a eliminar el archivo dentro del array de archivos');
                    comment.archivos = comment.archivos.filter((a: { _id: { toString: () => string; }; })=> a._id.toString()!==fileId);

                }catch(error:any){
                    console.log(`ha ocurrido un error inesperado ${error}`);
                }


            }


        } */


        //NOW IN THIS SECTION ASK IF THE USER UPLOAD NEW FILES INTO THE COMMENT
        /* if(data.archivosCargados && data.archivosCargados.length>0){

            try{

                for(const file of data.archivosCargados){

                    if (!file.buffer || !file.originalName) {
                        continue; // ignora archivos inválidos
                    }

                    // Generar nombre único para Backblaze
                    const nombreFinal = `${Date.now()}-${file.originalName}`;
                    console.log(`nombre del archivo mandado ${nombreFinal}`);


                    console.log('Empezamos a subir el archivo a lo que es el bucket de b2');
                    const fileName=await this._b2.uploadFile(
                        file.buffer,
                        nombreFinal
                    );

                    console.log(`nombre del archivo generado dentro del bucket, guardamos solo la ruta ${fileName}`);

                    //Montamos las url dadas y los nombres de los archivos
                    comment.archivos.push({
                        nombre: fileName,
                        url:fileName,
                        tamaño: file.size ? file.size.toString() :'0'
                    });

                    console.log(`ahora miramos como queda guardado dentro de la lista que nos guarda las rutas ${comment.archivos}`);

                }
                console.log('aqui termina el ciclo for');

            }catch(error:any){
                console.log(`ha ocurrido un error inesperado ${error}`);
            }
            
        } */

        try{
            await this.deleteFilesIntoB2AndArray(comment, data);

            /* const result=await this.uploadNewFileIntoB2ByUpdate(comment, data); */


            /* commentUpdated._id=result._id;
            commentUpdated.mensaje=result.mensaje;
            commentUpdated.tareaId=result.tareaId;
            commentUpdated.archivos=result.archivos ?? []; */


            const result=await this.uploadNewFileIntoB2ByUpdate(comment.archivos, data.archivosCargados ?? []);

            commentUpdated._id=comment._id;
            commentUpdated.mensaje=comment.mensaje ?? 'no message';
            commentUpdated.tareaId=comment.tareaId;
            commentUpdated.archivos=result ?? [];
            


            const commentUploaded=await this._repo.updateCommentsById(commentUpdated);

            if(!commentUploaded){
                throw new Error('no hemos logrado actualizar el comentario');
            }

            return this.fillComments(commentUpdated);



        }catch(error:any){
            console.log(`ha ocurrido un error inesperado ${error}`);
            throw new Error(`ha ocurrido un error inesperado ${error}`);

        }

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


    //METHOD TO DELETE THE FILE INTO B2 AND THE ARRAY INTO THE OBJECT CommentDTO
    private async deleteFilesIntoB2AndArray(comment:any, data:UpdateCommentFileDTO) : Promise<void> {
        //WE ASK IF THE USER SEND FILES OR THE ID THE FILE ID
        if(data.archivosEliminar && data.archivosEliminar?.length>0){
            //RUN THE FOR CICLE BY FIND THE FILEID TO DELETE
            for(const fileId of data.archivosEliminar){

                //SEARCH THE FILEID INTO THE COMMENTS.ARCHIVOS
                const fileFound=comment.archivos.find((a: { _id: { toString: () => string; }; })=> a._id.toString()===fileId);
                if(!fileFound){
                    console.log(`el archivo con id ${fileId} no se encuentra dentro del comentario`);
                    continue;
                }

                try{

                    console.log(`eliminaremos el archivo con nombre ${fileFound.nombre}`);

                    //DELETE THE FILE INTO THE BUCKET OF B2
                    await this._b2.deleteFile(fileFound.nombre);
                    console.log('archivo eliminado correctamente');

                    //DELETE THE FILE INTO THE ARRAY OF THE COMMENT ARCHIVOS
                    console.log('procederemos a eliminar el archivo dentro del array de archivos');
                    comment.archivos = comment.archivos.filter((a: { _id: { toString: () => string; }; })=> a._id.toString()!==fileId);

                }catch(error:any){
                    console.log(`ha ocurrido un error inesperado ${error}`);
                }


            }

            console.log('aqui se termina el ciclo for que nos eliminaba los archivos que estuviesen cargados');

        }
    }

    //METHOD TO UPLOAD THE FILE INTO THE BUCKET OF B2 AND INTO THE ARRAY OF COMMENT BY THE URL
    private async uploadNewFileIntoB2ByUpdate(comment:any[], data:FileInputDTO[]) : Promise<any> {
        //NOW IN THIS SECTION ASK IF THE USER UPLOAD NEW FILES INTO THE COMMENT
        /* if(data.archivosCargados && data.archivosCargados.length>0){ */
        if(data && data.length>0)
        {

            try{

                for(const file of data){

                    if (!file.buffer || !file.originalName) {
                        console.log('nombres invalidos o formato invalido');
                        continue; // ignora archivos inválidos
                    }

                    // Generar nombre único para Backblaze
                    const nombreFinal = `${Date.now()}-${file.originalName}`;
                    console.log(`nombre del archivo mandado ${nombreFinal}`);


                    console.log('Empezamos a subir el archivo a lo que es el bucket de b2');
                    const fileName=await this._b2.uploadFile(
                        file.buffer,
                        nombreFinal
                    );

                    console.log(`nombre del archivo generado dentro del bucket, guardamos solo la ruta ${fileName}`);

                    //Montamos las url dadas y los nombres de los archivos
                    /* comment.archivos.push({
                        nombre: fileName,
                        url:fileName,
                        tamaño: file.size ? file.size.toString() :'0'
                    }); */

                    comment.push({
                        nombre: fileName,
                        url:fileName,
                        tamaño: file.size ? file.size.toString() :'0'
                    });

                    /* console.log(`ahora miramos como queda guardado dentro de la lista que nos guarda las rutas ${comment.archivos}`); */
                    console.log(`ahora miramos como queda guardado dentro de la lista que nos guarda las rutas ${comment}`);
                }
                console.log('aqui termina el ciclo for');

            }catch(error:any){
                console.log(`ha ocurrido un error inesperado ${error}`);
            }
            
        }

        return comment;
    }
    
}