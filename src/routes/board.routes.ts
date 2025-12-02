import { Router } from "express";
import { BoardController } from "../controllers/BoardController";

const router=Router();
const boardController=new BoardController();


router.post('/createBoard',boardController.createBoard);

router.get('/getBoardByOwnerId/:userId',boardController.getAllBoardsByOwnerId);

router.get('/getBoardById/:id',boardController.getBoardById);

router.put('/updateBoard/:id',boardController.updateBoard);

router.delete('/deleteBoardById/:id',boardController.deleteBoard);


export default router;