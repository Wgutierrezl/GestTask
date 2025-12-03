import { url } from "inspector";
import { IB2Service } from "../interfaces/IB2/IB2Service";
import { ICommentsRepository } from "../interfaces/IComments/ICommentsRepository";
import { ICommentsService } from "../interfaces/IComments/ICommentsService";
import { CommentsDTO, CreateCommentDTO } from "../models/DTOs/CommentsDTO";
import { CommentsInfo } from "../models/DTOs/CommentsInfo";
import { CommentsEntity } from "../models/entities/CommentsEntity";
import { B2Service } from "./B2Service";

export class CommentService implements ICommentsService{

    private _repo:ICommentsRepository;
    private _b2: IB2Service;

    constructor(repo:ICommentsRepository, b2:IB2Service){
        this._repo=repo;
        this._b2=b2;
    }

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


    getAllCommentsByTaskId(id: string): Promise<CommentsInfo[] | null> {
        throw new Error("Method not implemented.");
    }
    updateCommentsById(id: string, data: CreateCommentDTO): Promise<CommentsInfo | null> {
        throw new Error("Method not implemented.");
    }
    getCommentById(id: string): Promise<CommentsInfo | null> {
        throw new Error("Method not implemented.");
    }


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