import { DashboardBoardDTO, DashboardDTO, DashboardUserDTO } from "../../models/DTOs/DashboardDTO";

export interface IDashboardService{
    getDashboardSummary() : Promise<DashboardDTO> ;
    getDashboardUserSummary(userId:string) : Promise<DashboardUserDTO | null>;
    getDashboardUserBoardsSummary_V2(userId:string) : Promise<DashboardBoardDTO[] | null>;
}