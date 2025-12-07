import { Router,Application } from "express";
import { PipelineController } from "../controllers/PipelineController";
import { authMiddleware } from "../middleware/genericMiddleware";
import { requireBoardRole } from "../middleware/middlewareBoards";

const router=Router();
const pipeController=new PipelineController();

/**
 * @swagger
 * tags:
 *   name: Pipelines
 *   description: Operaciones de pipelines
 */

/**
 * @swagger
 * /pipelines/createPipelines/boardId/{tableroId}:
 *   post:
 *     summary: Crear un nuevo pipeline dentro de un tablero
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero donde se creará el pipeline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Pipeline de ventas"
 *               descripcion:
 *                 type: string
 *                 example: "Flujo de etapas para ventas"
 *               estado:
 *                 type: string
 *                 example: "activo"
 *               tableroId:
 *                 type: string
 *                 example: "abc123"
 *               etapas:
 *                 type: array
 *                 description: Lista de etapas del pipeline
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: "Etapa inicial"
 *                     orden:
 *                       type: integer
 *                       example: 1
 *                   required:
 *                     - nombre
 *                     - orden
 *             required:
 *               - nombre
 *               - estado
 *               - tableroId
 *               - etapas
 *     responses:
 *       201:
 *         description: Pipeline creado exitosamente
 *       400:
 *         description: Petición inválida
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para esta acción
 *       500:
 *         description: Error interno del servidor
 */
router.post('/createPipelines/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro']),
            pipeController.createPipelines);


/**
 * @swagger
 * /pipelines/updatePipeline/{id}/boardId/{tableroId}:
 *   put:
 *     summary: Actualizar un pipeline existente
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pipeline a actualizar
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero al que pertenece el pipeline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Pipeline actualizado"
 *               descripcion:
 *                 type: string
 *                 example: "Descripción mejorada"
 *               estado:
 *                 type: string
 *                 example: "activo"
 *               tableroId:
 *                 type: string
 *                 example: "abc123"
 *               etapas:
 *                 type: array
 *                 description: Lista de etapas del pipeline
 *                 items:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                       example: "Nueva etapa"
 *                     orden:
 *                       type: integer
 *                       example: 1
 *                   required:
 *                     - nombre
 *                     - orden
 *             required:
 *               - nombre
 *               - estado
 *               - tableroId
 *               - etapas
 *     responses:
 *       200:
 *         description: Pipeline actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para esta acción
 *       404:
 *         description: Pipeline no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/updatePipeline/:id/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner','miembro'])  , 
            pipeController.updatePipeline);


/**
 * @swagger
 * /pipelines/getAllPipelines:
 *   get:
 *     summary: Obtener todos los pipelines del sistema
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los pipelines
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "pip123"
 *                   nombre:
 *                     type: string
 *                     example: "Pipeline de ventas"
 *                   descripcion:
 *                     type: string
 *                     example: "Flujo usado por el equipo comercial"
 *                   estado:
 *                     type: string
 *                     example: "activo"
 *                   tableroId:
 *                     type: string
 *                     example: "abc123"
 *                   etapas:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           example: "Prospección"
 *                         orden:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: No autorizado (Debe incluir bearer token)
 *       403:
 *         description: Acceso denegado (Rol no permitido)
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getAllPipelines',
            authMiddleware(['admin']),
            pipeController.getAllPipelines);


/**
 * @swagger
 * /pipelines/getPipelineById/{id}:
 *   get:
 *     summary: Obtener un pipeline por su ID
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pipeline a consultar
 *     responses:
 *       200:
 *         description: Pipeline encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "pip123"
 *                 nombre:
 *                   type: string
 *                   example: "Pipeline de ventas"
 *                 descripcion:
 *                   type: string
 *                   example: "Flujo usado por el equipo comercial"
 *                 estado:
 *                   type: string
 *                   example: "activo"
 *                 tableroId:
 *                   type: string
 *                   example: "abc123"
 *                 etapas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Prospección"
 *                       orden:
 *                         type: integer
 *                         example: 1
 *       400:
 *         description: Parámetro ID no enviado o inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pipeline no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getPipelineById/:id',
            authMiddleware(['admin','usuario']),
            pipeController.getPipelineById);


/**
 * @swagger
 * /pipelines/getPipelinesByBoardId/{boardId}:
 *   get:
 *     summary: Obtener un pipeline por su tableroId
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero para buscar
 *     responses:
 *       200:
 *         description: Pipelines encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "pip123"
 *                 nombre:
 *                   type: string
 *                   example: "Pipeline de ventas"
 *                 descripcion:
 *                   type: string
 *                   example: "Flujo usado por el equipo comercial"
 *                 estado:
 *                   type: string
 *                   example: "activo"
 *                 tableroId:
 *                   type: string
 *                   example: "abc123"
 *                 etapas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Prospección"
 *                       orden:
 *                         type: integer
 *                         example: 1
 *       400:
 *         description: Parámetro ID no enviado o inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 *       404:
 *         description: Pipeline no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getPipelinesByBoardId/:boardId',
            authMiddleware(['admin','usuario']),
            pipeController.getPipelineByBoardId);


/**
 * @swagger
 * /pipelines/deletePipelinesById/{id}/boardId/{tableroId}:
 *   delete:
 *     summary: Eliminar un pipeline por ID
 *     tags: [Pipelines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pipeline a eliminar
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero al que pertenece el pipeline
 *     responses:
 *       200:
 *         description: Pipeline eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Pipeline eliminado exitosamente"
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (debes ser owner del tablero)
 *       404:
 *         description: Pipeline no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/deletePipelinesById/:id/boardId/:tableroId',
                authMiddleware(['admin','usuario']),
                requireBoardRole(['owner']),
                pipeController.deletePipelineId);


export default router;