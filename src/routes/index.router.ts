import UserRoutes from './user.routes'
import PipeRoutes from './pipeline.routes';
import TaskRoutes from './task.routes';
import BoardRouter from './board.routes';
import CommentRouter from './comments.routes'
import BmRouter from './boardMember.routes'
import { Router } from 'express';

const router=Router();

router.use('/users',UserRoutes)
router.use('/boards',BoardRouter);
router.use('/boardMembers',BmRouter)
router.use('/pipelines',PipeRoutes);
router.use('/tasks', TaskRoutes);
router.use('/comments',CommentRouter);

export default router;