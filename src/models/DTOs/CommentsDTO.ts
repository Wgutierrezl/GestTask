export class FilesDTO{
    nombre?: string;
    url?: string;
    tamaño?: string;
}

export class CommentsDTO{
    tareaId!: string;
    usuarioId!: string;
    mensaje!: string;
    archivos?: FilesDTO[]
}



//CLASS TO CREATE A COMMET BECAUSE WE WAIT A FILE INTO THE ENDPOINT
export class FileInputDTO{
    originalName?: string;
    buffer?: Buffer;
    mimeType?: string;
    size?: number;
}

export class CreateCommentDTO{
    tareaId!: string;
    usuarioId!: string;
    mensaje!: string;
    archivos?: FileInputDTO[];
}