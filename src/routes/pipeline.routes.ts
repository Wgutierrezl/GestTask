import { Router,Application } from "express";
import { PipelineController } from "../controllers/PipelineController";
import { authMiddleware } from "../middleware/genericMiddleware";
import { requireBoardRole } from "../middleware/middlewareBoards";

const router=Router();
const pipeController=new PipelineController();

/**
 * @swagger
 * tags:
 *   name: Pipelines
 *   description: Operaciones de pipelines
 */

router.post('/createPipelines/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro']),
            pipeController.createPipelines);


router.put('/updatePipeline/:id/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro'])  , 
            pipeController.updatePipeline);

            
router.get('/getAllPipelines',
            authMiddleware(['admin']),
            pipeController.getAllPipelines);


router.get('/getPipelineById/:id',
            authMiddleware(['admin','usuario']),
            pipeController.getPipelineById);


router.get('/getPipelinesByBoardId/:boardId',
            authMiddleware(['admin','usuario']),
            pipeController.getPipelineByBoardId);


router.delete('/deletePipelinesById/:id/boardId/:tableroId',
                authMiddleware(['admin','usuario']),
                requireBoardRole(['owner']),
                pipeController.deletePipelineId);


export default router;