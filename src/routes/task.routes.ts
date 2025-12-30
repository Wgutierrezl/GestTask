import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middleware/genericMiddleware";
import { requireBoardRole } from "../middleware/middlewareBoards";

const router=Router();
const taskController=new TaskController();

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Operaciones de tareas
 */


/**
 * @swagger
 * /tasks/createTask/boardId/{tableroId}:
 *   post:
 *     summary: Crear una nueva tarea dentro de un tablero
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero al que pertenece la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Llamar al cliente"
 *               descripcion:
 *                 type: string
 *                 example: "Confirmar requisitos del proyecto"
 *               pipelineId:
 *                 type: string
 *                 example: "pip123"
 *               etapaId:
 *                 type: string
 *                 example: "etp456"
 *               asignadoA:
 *                 type: string
 *                 example: "user789"
 *               priodidad:
 *                 type: string
 *                 example: "alta"
 *               fechaLimite:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-20T23:59:59.000Z"
 *               fechaFinalizacion:
 *                 type: string
 *                 nullable: true
 *                 format: date-time
 *                 example: null
 *               tableroId:
 *                 type: string
 *                 example: "board123"
 *             required:
 *               - titulo
 *               - descripcion
 *               - pipelineId
 *               - etapaId
 *               - asignadoA
 *               - priodidad
 *               - fechaLimite
 *               - tableroId
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para realizar esta acción
 *       500:
 *         description: Error interno del servidor
 */
router.post('/createTask/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro']),
            taskController.createNewTask);

/**
 * @swagger
 * /tasks/updateTask/{id}/boardId/{tableroId}:
 *   put:
 *     summary: Actualizar una tarea existente
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea a actualizar
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero al que pertenece la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Actualizar documento"
 *               descripcion:
 *                 type: string
 *                 example: "Revisar y actualizar el informe del cliente"
 *               asignadoA:
 *                 type: string
 *                 example: "user789"
 *               priodidad:
 *                 type: string
 *                 example: "media"
 *               fechaLimite:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-10T23:59:59.000Z"
 *               fechaFinalizacion:
 *                 type: string
 *                 nullable: true
 *                 format: date-time
 *                 example: "2025-02-05T12:30:00.000Z"
 *             required:
 *               - titulo
 *               - descripcion
 *               - asignadoA
 *               - priodidad
 *               - fechaLimite
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/updateTask/:id/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro']),
            taskController.updateTask);


/**
 * @swagger
 * /tasks/updateStageTaskId/{taskId}/boardId/{tableroId}:
 *   put:
 *     summary: Actualizar la etapa de una tarea
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea a actualizar
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero al que pertenece la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stageId:
 *                 type: string
 *                 example: "fer54fs54s5df45d434"
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/updateStageTaskId/:taskId/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro']),
            taskController.updateStageTask);


/**
 * @swagger
 * /tasks/getAllTaskByPipeId/{pipelineId}:
 *   get:
 *     summary: Obtener todas las tareas asociadas a un pipeline
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pipeline del cual se desean obtener las tareas
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "task123"
 *                   titulo:
 *                     type: string
 *                     example: "Llamar al cliente"
 *                   descripcion:
 *                     type: string
 *                     example: "Confirmar requisitos del proyecto"
 *                   pipelineId:
 *                     type: string
 *                     example: "pip001"
 *                   etapaId:
 *                     type: string
 *                     example: "etp001"
 *                   asignadoA:
 *                     type: string
 *                     example: "user789"
 *                   priodidad:
 *                     type: string
 *                     example: "alta"
 *                   fechaLimite:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-20T23:59:59.000Z"
 *                   fechaFinalizacion:
 *                     type: string
 *                     nullable: true
 *                     format: date-time
 *                     example: null
 *                   tableroId:
 *                     type: string
 *                     example: "board123"
 *       400:
 *         description: Parámetro pipelineId inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron tareas para el pipeline
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getAllTaskByPipeId/:pipelineId',authMiddleware(['admin','usuario']),taskController.getTaskByPipelineId);

/**
 * @swagger
 * /tasks/getAllTaskByUserId/{userId}/pipelineId/{pipelineId}/boardId/{boardId}:
 *   get:
 *     summary: Obtener todas las tareas asociadas a un usuarioId
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario del cual se desean obtener las tareas
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pipeline donde se encuentra la tarea
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero donde se encuentra la tarea
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "task123"
 *                   titulo:
 *                     type: string
 *                     example: "Llamar al cliente"
 *                   descripcion:
 *                     type: string
 *                     example: "Confirmar requisitos del proyecto"
 *                   pipelineId:
 *                     type: string
 *                     example: "pip001"
 *                   etapaId:
 *                     type: string
 *                     example: "etp001"
 *                   asignadoA:
 *                     type: string
 *                     example: "user789"
 *                   priodidad:
 *                     type: string
 *                     example: "alta"
 *                   fechaLimite:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-20T23:59:59.000Z"
 *                   fechaFinalizacion:
 *                     type: string
 *                     nullable: true
 *                     format: date-time
 *                     example: null
 *                   tableroId:
 *                     type: string
 *                     example: "board123"
 *       400:
 *         description: Parámetro pipelineId inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron tareas para el pipeline
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getAllTaskByUserId/:userId/pipelineId/:pipelineId/boardId/:boardId',
            authMiddleware(['admin','usuario']),
            taskController.getTaskByUser_Pipeline_Board);

/**
 * @swagger
 * /tasks/getMyTaskByPipelineId/{pipelineId}/boardId/{boardId}:
 *   get:
 *     summary: Obtener todas las tareas asociadas a un usuarioId
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pipeline donde se encuentra la tarea
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero donde se encuentra la tarea
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "task123"
 *                   titulo:
 *                     type: string
 *                     example: "Llamar al cliente"
 *                   descripcion:
 *                     type: string
 *                     example: "Confirmar requisitos del proyecto"
 *                   pipelineId:
 *                     type: string
 *                     example: "pip001"
 *                   etapaId:
 *                     type: string
 *                     example: "etp001"
 *                   asignadoA:
 *                     type: string
 *                     example: "user789"
 *                   priodidad:
 *                     type: string
 *                     example: "alta"
 *                   fechaLimite:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-20T23:59:59.000Z"
 *                   fechaFinalizacion:
 *                     type: string
 *                     nullable: true
 *                     format: date-time
 *                     example: null
 *                   tableroId:
 *                     type: string
 *                     example: "board123"
 *       400:
 *         description: Parámetro pipelineId inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron tareas para el pipeline
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getMyTaskByPipelineId/:pipelineId/boardId/:boardId',
            authMiddleware(['admin','usuario']),
            taskController.getMyTaskByPipeline_Board_Id);

/**
 * @swagger
 * /tasks/getTaskById/{id}:
 *   get:
 *     summary: Obtener tarea por id
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea de la cual se desea obtener la tarea
 *     responses:
 *       200:
 *         description: Tarea obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "task123"
 *                   titulo:
 *                     type: string
 *                     example: "Llamar al cliente"
 *                   descripcion:
 *                     type: string
 *                     example: "Confirmar requisitos del proyecto"
 *                   pipelineId:
 *                     type: string
 *                     example: "pip001"
 *                   etapaId:
 *                     type: string
 *                     example: "etp001"
 *                   asignadoA:
 *                     type: string
 *                     example: "user789"
 *                   priodidad:
 *                     type: string
 *                     example: "alta"
 *                   fechaLimite:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-20T23:59:59.000Z"
 *                   fechaFinalizacion:
 *                     type: string
 *                     nullable: true
 *                     format: date-time
 *                     example: null
 *                   tableroId:
 *                     type: string
 *                     example: "board123"
 *       400:
 *         description: Parámetro pipelineId inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron tareas para el pipeline
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getTaskById/:id',authMiddleware(['admin','usuario']),taskController.getTaskById);


/**
 * @swagger
 * /tasks/deleteTaskById/{id}/boardId/{tableroId}:
 *   delete:
 *     summary: Eliminar un tarea por ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero a eliminar
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero al que pertenece la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Tarea eliminado exitosamente"
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (debes ser owner del tablero)
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/deleteTaskById/:id/boardId/:tableroId',
                authMiddleware(['admin','usuario']),
                requireBoardRole(['owner','miembro']),
                taskController.deleteTask);

/**
 * @swagger
 * /tasks/deleteTaskByPipelineId/{pipelineId}/boardId/{tableroId}:
 *   delete:
 *     summary: Eliminar un tareas por PipelineId
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pipelineId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero a eliminar
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero al que pertenece la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Tarea eliminado exitosamente"
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (debes ser owner del tablero)
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/deleteTaskByPipelineId/:pipelineId/boardId/:tableroId',
                authMiddleware(['admin','usuario']),
                requireBoardRole(['owner','miembro']),
                taskController.deleteTaskByPipelineId);


export default router;