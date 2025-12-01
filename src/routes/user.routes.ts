import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/genericMiddleware";

const router=Router();
const userController=new UserController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operaciones de usuarios
 */

/**
 * @swagger
 * /users/registerUser:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Marino
 *               correo:
 *                 type: string
 *                 example: marino@gmail.com
 *               edad:
 *                 type: number
 *                 example: 123456
 *               contrasena:
 *                 type: string
 *                 example: maradona
 *     responses:
 *       201:
 *         description: Usuario creado
 *       500:
 *         description: Error al registrar usuario
 */
router.post('/registerUser',authMiddleware(['admin']),userController.createUser);

router.post('/loginUser',userController.loginUser);

router.get('/getUserById/:id',authMiddleware(['admin','usuario']),userController.getUserById);

router.get('/getAllUsers',authMiddleware(['admin']),userController.getAllUsers);

export default router;