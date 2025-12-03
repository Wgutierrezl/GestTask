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