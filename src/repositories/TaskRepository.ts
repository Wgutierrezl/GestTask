import mongoose from "mongoose";
import { ITaskRepository } from "../interfaces/iTask/ITaskRepository";
import { TaskUpdateDTO } from "../models/DTOs/TaskUpdateDTO";
import { Tarea } from "../models/entities/Tareas";
import { TaskEntity } from "../models/entities/TaskEntity";

export class TaskRepository implements ITaskRepository{

    //METHOD TO DELETE A TASK
    async deleteTask(id: string): Promise<any> {
        const result=await Tarea.deleteOne({_id:new mongoose.Types.ObjectId(id)});
        return result.deletedCount>0;
    }

    //METHOD TO UPDATE A TASK
    async updateTask(data: TaskUpdateDTO): Promise<any> {
        return await Tarea.findByIdAndUpdate(data._id,data, {new:true});
    }

    //METHOD TO CREATE A NEW TASK
    async createTask(data: TaskEntity): Promise<any> {
        const task=new Tarea(data);
        return await task.save();
    }

    //METHOD TO GET ALL TASK BY PIPELINEID
    async getAllTaskByPipelineId(id: string): Promise<TaskEntity[]> {
        return await Tarea.find({pipelineId:id});
        
    }

    //METHOD TO GET ALL TASK BY USERID
    async getAllTaskByUser_Pipe_Board_Id(userId: string, pipelineId:string, boardId:string): Promise<TaskEntity[]> {
        /* return await Tarea.find({asignadoA:id}); */
        return await Tarea.find({
            asignadoA: userId,
            pipelineId: pipelineId,
            tableroId: boardId
        });
    }

    //METHOD TO GET TASK BY ID
    async getTaskById(id: string): Promise<any | null> {
        return await Tarea.findById(id);
    }
    
}