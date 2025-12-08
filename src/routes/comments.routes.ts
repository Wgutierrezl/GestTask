import { Router } from "express";
import { CommentsController } from "../controllers/CommentsController";
import upload from "../middleware/upload";
import { authMiddleware } from "../middleware/genericMiddleware";
import { requireBoardRole } from "../middleware/middlewareBoards";


const router=Router();
const commentController=new CommentsController();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Operaciones de comentarios
 */

/**
 * @swagger
 * /comments/createComment/boardId/{tableroId}:
 *   post:
 *     summary: Crear un comentario en una tarea (con archivos adjuntos)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tareaId:
 *                 type: string
 *                 description: ID de la tarea
 *                 example: "673be10c5d3fbb0608c036e1"
 *               usuarioId:
 *                 type: string
 *                 description: ID del usuario que comenta
 *                 example: "672aa94b13f37f87d44b821c"
 *               mensaje:
 *                 type: string
 *                 description: Texto del comentario
 *                 example: "Aquí dejo mi comentario con archivos adjuntos"
 *               archivos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Archivos adjuntos (imágenes, PDFs, etc)
 *           required:
 *             - tareaId
 *             - usuarioId
 *             - mensaje
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: No autorizado (token inválido)
 *       403:
 *         description: No tienes permisos para comentar
 *       500:
 *         description: Error interno del servidor
 */
router.post('/createComment/boardId/:tableroId',
            upload.array("archivos"),
            authMiddleware(['admin','usuario']), 
            requireBoardRole(['owner','miembro','invitado']),  
            commentController.createComment);

/**
 * @swagger
 * /comments/updateComment/{id}/boardId/{tableroId}:
 *   put:
 *     summary: Actualizar un comentario (mensaje, eliminar archivos o subir nuevos archivos)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a actualizar
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero relacionado
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mensaje:
 *                 type: string
 *                 description: Nuevo mensaje del comentario
 *                 example: "Actualizando el comentario y agregando nuevos archivos."
 *
 *               archivosEliminar:
 *                 type: array
 *                 description: Lista de IDs o nombres de archivos a eliminar
 *                 items:
 *                   type: string
 *                 example: ["file1.png", "file2.pdf"]
 *
 *               archivosCargados:
 *                 type: array
 *                 description: Nuevos archivos para adjuntar al comentario
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos para modificar este comentario
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/updateComment/:id/boardId/:tableroId',upload.array("archivosCargados"), 
            authMiddleware(['admin','usuario']), 
            requireBoardRole(['owner','miembro','invitado']),
            commentController.updateCommentById);

/**
 * @swagger
 * /comments/downloadFile/{commentId}/file/{fileId}:
 *   get:
 *     summary: Descargar un archivo asociado a un comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario al que pertenece el archivo
 *
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del archivo a descargar
 *
 *     responses:
 *       200:
 *         description: Archivo descargado exitosamente
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *
 *       400:
 *         description: Solicitud inválida
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *       403:
 *         description: No tienes permisos para acceder a este archivo
 *       404:
 *         description: Archivo o comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/downloadFile/:commentId/file/:fileId',
            authMiddleware(['admin','usuario']),
            commentController.downloadFileByCommentId);

/**
 * @swagger
 * /comments/deleteCommentById/{id}/boardId/{tableroId}:
 *   delete:
 *     summary: Eliminar un comentario por ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario a eliminar
 *
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero relacionado
 *
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Comentario eliminado correctamente"
 *
 *       400:
 *         description: Solicitud inválida
 *
 *       401:
 *         description: No autorizado (token inválido o ausente)
 *
 *       403:
 *         description: No tienes permisos para eliminar el comentario
 *
 *       404:
 *         description: Comentario no encontrado
 *
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/deleteCommentById/:id/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner']),
            commentController.deleteComment);

/**
 * @swagger
 * /comments/getAllCommentsByTaskId/{taskId}:
 *   get:
 *     summary: Obtener todos los comentarios asociados a una tarea
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 example:
 *                   id: "67ab9f0d2c4f121a30a312f4"
 *                   mensaje: "Este es el comentario"
 *                   usuarioId: "672aa94b13f37f87d44b821c"
 *                   tareaId: "673be10c5d3fbb0608c036e1"
 *                   archivos: []
 *                   creadoEn: "2025-02-13T18:00:00Z"
 *       400:
 *         description: Parámetro inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron comentarios para la tarea
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getAllCommentsByTaskId/:taskId',
            authMiddleware(['admin','usuario']),
            commentController.getAllCommentsByTaskId);

/**
 * @swagger
 * /comments/getCommentById/{id}:
 *   get:
 *     summary: Obtener un comentario por su ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "67ab9f0d2c4f121a30a312f4"
 *                 mensaje: "Comentario de ejemplo"
 *                 usuarioId: "672aa94b13f37f87d44b821c"
 *                 tareaId: "673be10c5d3fbb0608c036e1"
 *                 archivos: []
 *                 creadoEn: "2025-02-13T18:00:00Z"
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getCommentById/:id',
            authMiddleware(['admin','usuario']),
            commentController.getCommentById);

/**
 * @swagger
 * /comments/getMyCommentsByTaskId/{id}:
 *   get:
 *     summary: Obtener mis comentarios por tareaId
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Comentario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 id: "67ab9f0d2c4f121a30a312f4"
 *                 mensaje: "Comentario de ejemplo"
 *                 usuarioId: "672aa94b13f37f87d44b821c"
 *                 tareaId: "673be10c5d3fbb0608c036e1"
 *                 archivos: []
 *                 creadoEn: "2025-02-13T18:00:00Z"
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error interno del servidor
 */       
router.get('/getMyCommentsByTaskId/:id',
            authMiddleware(['admin','usuario']),
            commentController.getMyCommentsByTaskId)


export default router;