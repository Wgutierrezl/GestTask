import { Router } from "express";
import { CommentsController } from "../controllers/CommentsController";
import upload from "../middleware/upload";


const router=Router();
const commentController=new CommentsController();


router.post('/createComment',upload.array("archivos"),commentController.createComment);


export default router;