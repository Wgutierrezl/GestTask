import { Router,Application } from "express";
import { PipelineController } from "../controllers/PipelineController";
import { authMiddleware } from "../middleware/genericMiddleware";

const router=Router();
const pipeController=new PipelineController();


router.post('/createPipelines',authMiddleware(['admin','usuario']),pipeController.createPipelines);

router.put('/updatePipeline/:id', pipeController.updatePipeline);

router.get('/getAllPipelines',authMiddleware(['admin']),pipeController.getAllPipelines);

router.get('/getPipelineById/:id',authMiddleware(['admin','usuario']),pipeController.getPipelineById);

router.get('/getPipelinesByOwnerId/:userId',authMiddleware(['admin','usuario']) ,pipeController.getPipelineByOwnerId);


export default router;