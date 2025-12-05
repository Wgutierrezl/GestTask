import { Router } from "express";
import { BoardMemberController } from "../controllers/BoardMemberController";


const router=Router();
const bm_Controller=new BoardMemberController();



router.post('/addMember',bm_Controller.createMember);


router.put('/updateBoardMemberById/:id',bm_Controller.updateBoardMemberById);


router.get('/getAllBoardsMembersByUserId/:userId',bm_Controller.getAllBoardMemberByUserId);


router.get('/getAllMemberByBoardId/:boardId',bm_Controller.getAllMembersByBoardId);


router.get('/getBoardMemberById/:id',bm_Controller.getBoardMemberById);


router.delete('/deleteBoardMemberById/:id',bm_Controller.deleteBoardMemberById);


export default router;