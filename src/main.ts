import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import connectDB from './config/config-mongodb';
import UserRoutes from './routes/user.routes'
import PipeRoutes from './routes/pipeline.routes';
import TaskRoutes from './routes/task.routes';
import BoardRouter from './routes/board.routes';
import CommentRouter from './routes/comments.routes'
import { swaggerSetUp } from './config/swagger-config';

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		console.log('Iniciando verificación de conexión a la base de datos...');
		await connectDB();
		console.log('Conexión a la base de datos verificada. Montando servidor...');

		const app: Application=express();
		app.use(cors());
		app.use(express.json());

		app.use('/users',UserRoutes)

		app.use('/boards',BoardRouter);

		app.use('/pipelines',PipeRoutes);

		app.use('/tasks', TaskRoutes);

		app.use('/comments',CommentRouter);

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

