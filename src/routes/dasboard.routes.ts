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


export default router;