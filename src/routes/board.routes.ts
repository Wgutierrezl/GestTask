import { Router } from "express";
import { BoardController } from "../controllers/BoardController";
import { authMiddleware } from "../middleware/genericMiddleware";

const router=Router();
const boardController=new BoardController();


router.post('/createBoard', 
            authMiddleware(['admin','usuario']),
            boardController.createBoard);

router.get('/getBoardByOwnerId/:userId',
            authMiddleware(['admin','usuario']),
            boardController.getAllBoardsByOwnerId);

router.get('/getBoardById/:id',
            authMiddleware(['admin','usuario']),
            boardController.getBoardById);

router.put('/updateBoard/:id', 
            authMiddleware(['admin','usuario']),
            boardController.updateBoard);

router.delete('/deleteBoardById/:id',
            authMiddleware(['admin','usuario']),
            boardController.deleteBoard);


export default router;