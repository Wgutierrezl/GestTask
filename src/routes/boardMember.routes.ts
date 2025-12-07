import { Router } from "express";
import { BoardMemberController } from "../controllers/BoardMemberController";
import { authMiddleware } from "../middleware/genericMiddleware";
import { requireBoardRole } from "../middleware/middlewareBoards";


const router=Router();
const bm_Controller=new BoardMemberController();

/**
 * @swagger
 * tags:
 *   name: Board_Members
 *   description: Operaciones de miembros de tableros
 */


/**
 * @swagger
 * /boardMembers/addMember:
 *   post:
 *     summary: Agregar un miembro a un tablero
 *     tags: [Board_Members]
 *     security:
 *       - bearerAuth: []   # Requiere token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableroId:
 *                 type: string
 *                 example: "6734bcd8af98c01b234ac901"
 *               usuarioId:
 *                 type: string
 *                 example: "6734bd77ae19ac1b239be102"
 *               rol:
 *                 type: string
 *                 example: "miembro"
 *             required:
 *               - tableroId
 *               - usuarioId
 *               - rol
 *     responses:
 *       201:
 *         description: Miembro agregado correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado (rol insuficiente)
 *       404:
 *         description: Tablero o usuario no encontrado
 *       500:
 *         description: Error al agregar el miembro
 */
router.post('/addMember',
            authMiddleware(['admin','usuario']), 
            requireBoardRole(['owner','miembro']), 
            bm_Controller.createMember);

/**
 * @swagger
 * /boardMembers/updateBoardMemberById/{id}:
 *   put:
 *     summary: Actualizar un miembro de tablero por ID
 *     tags: [Board_Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del miembro dentro del tablero
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableroId:
 *                 type: string
 *                 example: "673a3f6c8c9c1b34fa11aabc"
 *               usuarioId:
 *                 type: string
 *                 example: "673a3f6c8c9c1b34fa11x999"
 *               rol:
 *                 type: string
 *                 enum: [owner, miembro, invitado]
 *                 example: miembro
 *     responses:
 *       200:
 *         description: Miembro actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Rol no autorizado (solo owner puede actualizar)
 *       404:
 *         description: Miembro no encontrado
 *       500:
 *         description: Error al actualizar miembro
 */
router.put('/updateBoardMemberById/:id',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner']),
            bm_Controller.updateBoardMemberById);

/**
 * @swagger
 * /boardMembers/getAllBoardsMembersByUserId/{userId}:
 *   get:
 *     summary: Obtener todos los tableros a los cuales pertenece un usuario
 *     tags: [Board_Members]
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
 *         description: Tableros del usuario encontrados
 *       404:
 *         description: Tableros del usuario no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al obtener los tableros del usuario
 */
router.get('/getAllBoardsMembersByUserId/:userId',bm_Controller.getAllBoardMemberByUserId);

/**
 * @swagger
 * /boardMembers/getAllMemberByBoardId/{boardId}:
 *   get:
 *     summary: Obtener todos los tableros a los cuales pertenece un usuario
 *     tags: [Board_Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero
 *     responses:
 *       200:
 *         description: Miembros del tablero encontrados
 *       404:
 *         description: Miembros del tablero no encontrados
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al obtener los tableros del usuario
 */
router.get('/getAllMemberByBoardId/:boardId',bm_Controller.getAllMembersByBoardId);

/**
 * @swagger
 * /boardMembers/getBoardMemberById/{id}:
 *   get:
 *     summary: Obtener miembro del tablero por id 
 *     tags: [Board_Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del miembro del tablero
 *     responses:
 *       200:
 *         description: Miembro del tablero encontrado
 *       404:
 *         description: No se encuentra el miembro del tablero
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al obtener los tableros del usuario
 */
router.get('/getBoardMemberById/:id',bm_Controller.getBoardMemberById);

/**
 * @swagger
 * /boardMembers/deleteBoardMemberById/{id}/boardId/{tableroId}:
 *   delete:
 *     summary: Eliminar un miembro del tablero por ID y tableroId
 *     tags: [Board_Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del miembro del tablero para eliminar
 *       - in: path
 *         name: tableroId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del tablero al cual pertenece el miembro
 *     responses:
 *       200:
 *         description: Miembro del tablero eliminado correctamente
 *       404:
 *         description: Miembro o tablero no encontrado
 *       403:
 *         description: Rol no autorizado
 *       500:
 *         description: Error al eliminar el miembro del tablero
 */
router.delete('/deleteBoardMemberById/:id/boardId/:tableroId',
            authMiddleware(['admin','usuario']),
            requireBoardRole(['owner']),
            bm_Controller.deleteBoardMemberById);


export default router;