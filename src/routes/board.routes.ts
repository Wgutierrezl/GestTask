import { Router } from "express";
import { BoardController } from "../controllers/BoardController";
import { authMiddleware } from "../middleware/genericMiddleware";

const router=Router();
const boardController=new BoardController();

/**
 * @swagger
 * tags:
 *   name: Board
 *   description: Operaciones de tableros
 */


/**
 * @swagger
 * /boards/createBoard:
 *   post:
 *     summary: Crear un nuevo tablero
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Tablero de prueba
 *               descripcion:
 *                 type: string
 *                 example: este es un tablero para la descripcion
 *               ownerId:
 *                 type: string
 *                 example: asd1221
 *     responses:
 *       201:
 *         description: Tablero creado correctamente
 *       500:
 *         description: Error al crear el tablero
 */
router.post('/createBoard', 
            authMiddleware(['admin','usuario']),
            boardController.createBoard);

/**
 * @swagger
 * /boards/getBoardByOwnerId/{userId}:
 *   get:
 *     summary: Obtener un usuario por ID (solo Admin)
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Tablero del usuario encontrado
 *       404:
 *         description: Tablero del usuario no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al obtener el usuario
 */
router.get('/getBoardByOwnerId/:userId',
            authMiddleware(['admin','usuario']),
            boardController.getAllBoardsByOwnerId);

/**
 * @swagger
 * /boards/getBoardById/{id}:
 *   get:
 *     summary: Obtener tablero por Id
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero
 *     responses:
 *       200:
 *         description: Tablero encontrado
 *       404:
 *         description: Tablero no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al obtener tablero
 */
router.get('/getBoardById/:id',
            authMiddleware(['admin','usuario']),
            boardController.getBoardById);
/**
 * @swagger
 * /boards/updateBoard/{id}:
 *   put:
 *     summary: Actualizar un tablero por ID
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Nuevo nombre del tablero"
 *               descripcion:
 *                 type: string
 *                 example: "Descripción actualizada"
 *               ownerId:
 *                 type: string
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Tablero actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Tablero no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al actualizar tablero
 */
router.put('/updateBoard/:id', 
            authMiddleware(['admin','usuario']),
            boardController.updateBoard);

/**
 * @swagger
 * /boards/getMyBoards:
 *   get:
 *     summary: Obtener mis tableros
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tablero encontrado
 *       404:
 *         description: Tablero no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al obtener tablero
 */
router.get('/getMyBoards',
            authMiddleware(['admin','usuario']),
            boardController.getMyBoards)

/**
 * @swagger
 * /boards/deleteBoardById/{id}:
 *   delete:
 *     summary: Eliminar un tablero por ID
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero a eliminar
 *     responses:
 *       200:
 *         description: Tablero eliminado correctamente
 *       404:
 *         description: Tablero no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al eliminar el tablero
 */
router.delete('/deleteBoardById/:id',
            authMiddleware(['admin','usuario']),
            boardController.deleteBoard);


export default router;