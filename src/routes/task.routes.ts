import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middleware/genericMiddleware";

const router=Router();
const taskController=new TaskController();


router.post('/createTask',authMiddleware(['admin','usuario']),taskController.createNewTask);


router.put('/updateTask/:id',taskController.updateTask);


router.get('/getAllTaskByPipeId/:pipelineId',authMiddleware(['admin','usuario']),taskController.getTaskByPipelineId);


router.get('/getAllTaskByUserId/:userId',authMiddleware(['admin','usuario']),taskController.getTaskByUserId);


router.get('/getTaskById/:id',authMiddleware(['admin','usuario']),taskController.getTaskById);


export default router;