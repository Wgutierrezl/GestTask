import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middleware/genericMiddleware";
import { requireBoardRole } from "../middleware/middlewareBoards";

const router=Router();
const taskController=new TaskController();


router.post('/createTask/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro']),
            taskController.createNewTask);


router.put('/updateTask/:id/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro']),
            taskController.updateTask);


router.get('/getAllTaskByPipeId/:pipelineId',authMiddleware(['admin','usuario']),taskController.getTaskByPipelineId);


router.get('/getAllTaskByUserId/:userId',authMiddleware(['admin','usuario']),taskController.getTaskByUserId);


router.get('/getTaskById/:id',authMiddleware(['admin','usuario']),taskController.getTaskById);


router.delete('/deleteTaskById/:id/boardId/:tableroId',
                authMiddleware(['admin','usuario']),
                requireBoardRole(['owner','miembro']),
                taskController.deleteTask);


export default router;