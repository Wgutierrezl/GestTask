export class DashboardDTO{
    totalBoards?:number;
    totalPipelines?:number;
    totalTask?:number;
    totalComments?:number;
    totalUsers?:number;
}

export class DashboardUserDTO{
    totalBoards?:number;
    totalPipelines?:number;
    totalTask?:number;
    totalComments?:number;
}

export class DashboardBoardDTO{
    id!:string;
    nombre?:string;
    descripcion?:string;
    ownerId?:string
    totalPipelines?:number;
    totalTask?:number;
    totalMembers?:number;
}