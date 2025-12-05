import { Router } from "express";
import { BoardMemberController } from "../controllers/BoardMemberController";
import { authMiddleware } from "../middleware/genericMiddleware";
import { requireBoardRole } from "../middleware/middlewareBoards";


const router=Router();
const bm_Controller=new BoardMemberController();



router.post('/addMember',
            authMiddleware(['admin','usuario']), 
            requireBoardRole(['owner','miembro']), 
            bm_Controller.createMember);


router.put('/updateBoardMemberById/:id',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner']),
            bm_Controller.updateBoardMemberById);


router.get('/getAllBoardsMembersByUserId/:userId',bm_Controller.getAllBoardMemberByUserId);


router.get('/getAllMemberByBoardId/:boardId',bm_Controller.getAllMembersByBoardId);


router.get('/getBoardMemberById/:id',bm_Controller.getBoardMemberById);


router.delete('/deleteBoardMemberById/:id/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner']),
            bm_Controller.deleteBoardMemberById);


export default router;