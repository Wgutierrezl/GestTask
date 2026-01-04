import { IBoardService } from "../interfaces/IBoard/IBoardService";
import { IBUsersService } from "../interfaces/IBUsers/IBUsersService";
import { ICommentsService } from "../interfaces/IComments/ICommentsService";
import { IDashboardService } from "../interfaces/IDashboard/IDashboardService";
import { IPipelinesService } from "../interfaces/iPipelines/IPipelinesService";
import { ITaskService } from "../interfaces/iTask/ITaskService";
import { IUserService } from "../interfaces/iUser/IUserService";
import { DashboardBoardDTO, DashboardDTO, DashboardUserDTO } from "../models/DTOs/DashboardDTO";

export class DashboardService implements IDashboardService{

    private readonly _userService: IUserService;
    private readonly _boardService: IBoardService;
    private readonly _pipelinesService: IPipelinesService;
    private readonly _taskService: ITaskService;
    private readonly _commentService : ICommentsService;
    private readonly _boardMember: IBUsersService;

    constructor(userService : IUserService,
                boardService: IBoardService,
                pipelinesService: IPipelinesService,
                taskService : ITaskService,
                commentService: ICommentsService,
                boardMember: IBUsersService
    )
    {
        this._userService=userService;
        this._boardService=boardService;
        this._pipelinesService=pipelinesService;
        this._taskService=taskService;
        this._commentService=commentService;
        this._boardMember=boardMember;
    }


    async getDashboardUserBoardsSummary_V2(userId: string): Promise<DashboardBoardDTO[] | null> {
        try{
            const boards=await this._boardService.getAllBoardByOnwnerId(userId);
            console.log(`tableros encontrados ${boards}`);
            if(!boards){
                return null;
            }

            const result: DashboardBoardDTO[] = [];

            for(const board of boards){
                const pipelines=await this._pipelinesService.getTotalPipelinesIdByBoardsId([board._id.toString()]);
                console.log(`cantidad de pipelines hallados ${pipelines.length}`);

                const taskCounts=await this._taskService.getTotalTaskByPipelinesId(pipelines);
                console.log(`cantidad de tareas del pipelines ${taskCounts}`);

                const members=await this._boardMember.getBoardMemberByBoardId(board._id);
                console.log(`cantidad de miembros del tablero hallados ${members?.length}`);

                result.push({
                    id:board._id,
                    nombre:board.nombre,
                    descripcion:board.descripcion,
                    ownerId: board.ownerId,
                    totalPipelines:pipelines.length ?? 0,
                    totalTask: taskCounts ?? 0,
                    totalMembers: members?.length ?? 0
                });
            
            }

            return result;

        }catch(error:any){
            console.log(`ha ocurrido un error inesperado ${error.message}`);
            throw error;
        }
    }

    async getDashboardUserSummary(userId: string): Promise<DashboardUserDTO | null> {
        try{
            const boardRes=await this._boardService.getAllBoardByOnwnerId(userId);
            if(!boardRes || boardRes.length===0){
                return null;
            }

            const boardsId=boardRes.map(p=> p._id);

            const [pipelineRes, taskRes, commentRes]= await Promise.all([
                this._pipelinesService.getTotalPipelinesByBoardsId(boardsId),
                this._taskService.getTotalTaskByUserId(userId),
                this._commentService.getTotalCommentsByUserId(userId)
            ]);

            const userDashboard=new DashboardUserDTO();

            userDashboard.totalBoards=boardRes.length ?? 0;
            userDashboard.totalPipelines=pipelineRes ?? 0;
            userDashboard.totalTask=taskRes ?? 0;
            userDashboard.totalComments=commentRes ?? 0;

            return userDashboard;

        }catch(error:any){
            console.log(`ha currido un error inesperado ${error.message}`);
            throw error;
        }
    }

    async getDashboardSummary(): Promise<DashboardDTO> {
        const [userRes,boardRes, pipeRes, taskRes, commentRes]=await Promise.all([
            this._userService.getTotalUsersCount(),
            this._boardService.getTotalBoardsCount(),
            this._pipelinesService.getTotalPipelinesCount(),
            this._taskService.getTotalTtasksCount(),
            this._commentService.getTotalCommentsCount(),
        ]);

        const dash=new DashboardDTO();

        dash.totalUsers=userRes ?? 0;
        dash.totalBoards=boardRes ?? 0;
        dash.totalPipelines=pipeRes ?? 0;
        dash.totalTask=taskRes ?? 0;
        dash.totalComments=commentRes ?? 0;

        return dash;
    }

}