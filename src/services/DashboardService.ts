import { IBoardService } from "../interfaces/IBoard/IBoardService";
import { ICommentsService } from "../interfaces/IComments/ICommentsService";
import { IDashboardService } from "../interfaces/IDashboard/IDashboardService";
import { IPipelinesService } from "../interfaces/iPipelines/IPipelinesService";
import { ITaskService } from "../interfaces/iTask/ITaskService";
import { IUserService } from "../interfaces/iUser/IUserService";
import { DashboardDTO } from "../models/DTOs/DashboardDTO";

export class DashboardService implements IDashboardService{

    private readonly _userService: IUserService;
    private readonly _boardService: IBoardService;
    private readonly _pipelinesService: IPipelinesService;
    private readonly _taskService: ITaskService;
    private readonly _commentService : ICommentsService;

    constructor(userService : IUserService,
                boardService: IBoardService,
                pipelinesService: IPipelinesService,
                taskService : ITaskService,
                commentService: ICommentsService
    )
    {
        this._userService=userService;
        this._boardService=boardService;
        this._pipelinesService=pipelinesService;
        this._taskService=taskService;
        this._commentService=commentService;
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