import { Router } from "express";
import { CommentsController } from "../controllers/CommentsController";
import upload from "../middleware/upload";


const router=Router();
const commentController=new CommentsController();


router.post('/createComment',upload.array("archivos"),commentController.createComment);

router.get('/downloadFile/:commentId/file/:fileId',commentController.downloadFileByCommentId);

router.delete('/deleteCommentById/:id',commentController.deleteComment);

router.get('/getAllCommentsByTaskId/:taskId',commentController.getAllCommentsByTaskId);

router.get('/getCommentById/:id',commentController.getCommentById);


export default router;