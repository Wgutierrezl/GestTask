import { Router } from "express";
import { CommentsController } from "../controllers/CommentsController";
import upload from "../middleware/upload";
import { authMiddleware } from "../middleware/genericMiddleware";
import { requireBoardRole } from "../middleware/middlewareBoards";


const router=Router();
const commentController=new CommentsController();


router.post('/createComment/boardId/:tableroId',
            upload.array("archivos"),
            authMiddleware(['admin','usuario']), 
            requireBoardRole(['owner','miembro','invitado']),  
            commentController.createComment);


router.put('/updateComment/:id/boardId/:tableroId',upload.array("archivosCargados"), 
            authMiddleware(['admin','usuario']), 
            requireBoardRole(['owner','miembro','invitado']),
            commentController.updateCommentById);


router.get('/downloadFile/:commentId/file/:fileId',
            authMiddleware(['admin','usuario']),
            commentController.downloadFileByCommentId);


router.delete('/deleteCommentById/:id/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner']),
            commentController.deleteComment);


router.get('/getAllCommentsByTaskId/:taskId',
            authMiddleware(['admin','usuario']),
            commentController.getAllCommentsByTaskId);


router.get('/getCommentById/:id',
            authMiddleware(['admin','usuario']),
            commentController.getCommentById);


export default router;