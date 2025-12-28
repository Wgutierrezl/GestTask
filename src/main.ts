import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import connectDB from './config/config-mongodb';
/* import UserRoutes from './routes/user.routes'
import PipeRoutes from './routes/pipeline.routes';
import TaskRoutes from './routes/task.routes';
import BoardRouter from './routes/board.routes';
import CommentRouter from './routes/comments.routes'
import BmRouter from './routes/boardMember.routes' */
import router from './routes/index.router';
import { swaggerSetUp } from './config/swagger-config';

const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [];
console.log("CORS Allowed Origins:", allowedOrigins);

async function start() {
	try {
		console.log('Iniciando verificación de conexión a la base de datos...');
		await connectDB();
		console.log('Conexión a la base de datos verificada. Montando servidor...');

		const app: Application=express();
		app.use(cors({
			origin: function(origin, callback) {
			// si no viene origin (ej Postman) permitir
			if (!origin) return callback(null, true);

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error('Not allowed by CORS'));
		},
		credentials: true
		}));

		app.use(express.json());

		/* app.use('/users',UserRoutes)

		app.use('/boards',BoardRouter);

		app.use('/boardMembers',BmRouter)

		app.use('/pipelines',PipeRoutes);

		app.use('/tasks', TaskRoutes);

		app.use('/comments',CommentRouter); */

		app.use('/prod/api',router);

		// Health check (útil para comprobar que el servidor responde)
		app.get('/health', (_req, res) => {
			return res.json({ status: 'ok', db: 'task_db' });
		});

		swaggerSetUp(app);

		// Aquí se montarán las rutas cuando estén listas
		// Ejemplo: app.use('/api/tasks', tasksRouter);

		app.listen(PORT, () => {
			console.log(`Servidor escuchando en http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Fallo al iniciar la aplicación:', error);
		process.exit(1);
	}
}

start();

