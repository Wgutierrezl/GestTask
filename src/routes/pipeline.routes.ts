import { Router,Application } from "express";
import { PipelineController } from "../controllers/PipelineController";

const router=Router();
const pipeController=new PipelineController();


router.post('/createPipelines',pipeController.createPipelines);

router.get('/getAllPipelines',pipeController.getAllPipelines);

router.get('/getPipelineById/:id',pipeController.getPipelineById);

router.get('/getPipelinesByOwnerId/:userId', pipeController.getPipelineByOwnerId);


export default router;