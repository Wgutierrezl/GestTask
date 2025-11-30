import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const router=Router();
const taskController=new TaskController();


router.post('/createTask',taskController.createNewTask);


router.get('/getAllTaskByPipeId/:pipelineId',taskController.getTaskByPipelineId);


router.get('/getAllTaskByUserId/:userId',taskController.getTaskByUserId);


router.get('/getTaskById/:id',taskController.getTaskById);


export default router;