import { HasherService } from "../custom/HasherService";
import { TokenService } from "../custom/TokenService";
import { IDashboardService } from "../interfaces/IDashboard/IDashboardService";
import { AuthRequest } from "../middleware/genericMiddleware";
import { BoardRepository } from "../repositories/BoardsRepository";
import { BUsersRepository } from "../repositories/BUsersRepository";
import { CommentsRepository } from "../repositories/CommentsRepository";
import { PipelinesRepository } from "../repositories/PipelinesRepository";
import { TaskRepository } from "../repositories/TaskRepository";
import { UserRepository } from "../repositories/UserRepository";
import { B2Service } from "../services/B2Service";
import { BoardService } from "../services/BoardService";
import { BUsersService } from "../services/BUsersService";
import { CommentService } from "../services/CommentService";
import { DashboardService } from "../services/DashboardService";
import { PipelinesService } from "../services/PipelinesService";
import { TaskService } from "../services/TaskService";
import { UserService } from "../services/UserService";
import { Response } from "express";

export class DashboardController{
    private readonly _dashboardService : IDashboardService;

    constructor(){

        //DEPENDENCIES FOR THE USER SERVICE
        const userRepository=new UserRepository();
        const tokenService=new TokenService();
        const hashed=new HasherService();
        const userService=new UserService(userRepository, tokenService, hashed);

        //DEPENDENCIES FOR THE PIPELINES SERVICE
        const pipelineRepo=new PipelinesRepository();
        const taskRepo=new TaskRepository();

        //DEPENDENCIES FOR THE COMMENTS
        const commentRepo=new CommentsRepository();
        const b2Service=new B2Service();
        const commentService=new CommentService(commentRepo, b2Service);

        //DEPENDECIES FOR THE TASK
        const taskService=new TaskService(taskRepo, commentService);
        const pipelineService=new PipelinesService(pipelineRepo,taskService);

        //DEPENDENCIES POR THE BOARDS
        const repoBoard=new BoardRepository();
        const _repoMember=new BUsersRepository()
        const boardMember=new BUsersService(_repoMember)
        const boardService=new BoardService(repoBoard,boardMember,pipelineService);

        //DEPENDECIES FOR THE BOARD MEMBER
        const boardMemberRepo=new BUsersRepository();
        const boardMemberService=new BUsersService(boardMemberRepo);


        const dashboard=new DashboardService(userService,
                                             boardService,
                                             pipelineService,
                                             taskService,
                                             commentService,
                                             boardMemberService
        );

        this._dashboardService=dashboard;
    }


    getDashboardSummary=async(req:AuthRequest, res:Response) : Promise<Response> => {
        try{
            const response=await this._dashboardService.getDashboardSummary();
            if(!response){
                return res.status(400).json({message:'no hemos logrado obtener el resumen'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message}`});

        }
    }


    getUserDashboardSummary=async(req:AuthRequest, res:Response) => {
        try{
            const {userId}=req.params
            if(!userId){
                return res.status(400).json({message:'debes de digitar el id del usuario'});
            }

            const response=await this._dashboardService.getDashboardUserSummary(userId);
            if(!response){
                return res.status(400).json({message:'el usuario aun no tiene registro de actividades dentro del aplicativo'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message}`});
        }
    }

    
    getUserBoardDashboardSummary=async(req:AuthRequest, res:Response) => {
        try{
            const {userId}=req.params;
            if(!userId){
                return res.status(400).json({message:'debes de digitar el id del usuario'});
            }

            const response=await this._dashboardService.getDashboardUserBoardsSummary_V2(userId);
            if(!response || response.length===0){
                return res.status(400).json({message:'el usuario aun no ha creado nada'});
            }

            return res.status(200).json(response);

        }catch(error:any){
            return res.status(500).json({message:`ha ocurrido un error inesperado ${error.message}`});
        }
    }
}