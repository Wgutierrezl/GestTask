import { DashboardDTO } from "../../models/DTOs/DashboardDTO";

export interface IDashboardService{
    getDashboardSummary() : Promise<DashboardDTO> ;
}