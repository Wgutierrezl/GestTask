import { Router } from "express"
import { DashboardController } from "../controllers/DashboardController"
import { authMiddleware } from "../middleware/genericMiddleware"

const router=Router();
const dashController=new DashboardController();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Operaciones para el dashboard
 */

/**
 * @swagger
 * /dashboard/getDashboardSummary:
 *   get:
 *     summary: Obtener resumen general del dashboard de administración
 *     description: Retorna métricas globales del sistema para el dashboard del administrador.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen del dashboard obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBoards:
 *                   type: integer
 *                   example: 120
 *                 totalPipelines:
 *                   type: integer
 *                   example: 340
 *                 totalTask:
 *                   type: integer
 *                   example: 5600
 *                 totalComments:
 *                   type: integer
 *                   example: 21000
 *                 totalUsers:
 *                   type: integer
 *                   example: 85
 *       403:
 *         description: Acceso denegado. Rol no autorizado
 *       500:
 *         description: Error interno al obtener el resumen del dashboard
 */
router.get('/getDashboardSummary',
            authMiddleware(['admin']),
            dashController.getDashboardSummary);

   
/**
 * @swagger
 * /dashboard/getUserDashboardSummary/{userId}:
 *   get:
 *     summary: Obtener resumen del dashboard de un usuario
 *     description: Devuelve estadísticas globales de uso de la aplicación para un usuario específico.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a consultar
 *     responses:
 *       200:
 *         description: Resumen del dashboard del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBoards:
 *                   type: integer
 *                   example: 5
 *                 totalPipelines:
 *                   type: integer
 *                   example: 12
 *                 totalTask:
 *                   type: integer
 *                   example: 87
 *                 totalComments:
 *                   type: integer
 *                   example: 230
 *       400:
 *         description: Parámetro userId inválido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado (solo administradores)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */            
router.get('/getUserDashboardSummary/:userId',
            authMiddleware(['admin']),
            dashController.getUserDashboardSummary
)

/**
 * @swagger
 * /dashboard/getUserBoardDashboardSummary/{userId}:
 *   get:
 *     summary: Obtener resumen del dashboard de tableros por usuario
 *     description: >
 *       Retorna un resumen por cada tablero del usuario,
 *       incluyendo cantidad de pipelines, tareas y miembros.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario propietario de los tableros
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resumen del dashboard por tablero
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "65a9f3c4d8f4a2e9a1b12345"
 *                   nombre:
 *                     type: string
 *                     example: "Tablero de Desarrollo"
 *                   descripcion:
 *                     type: string
 *                     example: "Tablero del equipo backend"
 *                   ownerId:
 *                     type: string
 *                     example: "65a9f3c4d8f4a2e9a1b99999"
 *                   totalPipelines:
 *                     type: integer
 *                     example: 4
 *                   totalTask:
 *                     type: integer
 *                     example: 27
 *                   totalMembers:
 *                     type: integer
 *                     example: 6
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado (rol no permitido)
 *       404:
 *         description: El usuario no tiene tableros
 *       500:
 *         description: Error interno del servidor
 */
router.get('/getUserBoardDashboardSummary/:userId',
            authMiddleware(['admin']),
            dashController.getUserBoardDashboardSummary
)


export default router;