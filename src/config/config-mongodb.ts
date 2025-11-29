import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_DB = 'task_db';
const DEFAULT_URI = `mongodb://127.0.0.1:27017/${DEFAULT_DB}`;

const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

export async function connectDB(): Promise<void> {
	try {
		// Add listeners before connecting for reliable event delivery
		mongoose.connection.on('connecting', () => {
			console.log('MongoDB: intentando conectar...');
		});

		mongoose.connection.on('connected', () => {
			console.log(`MongoDB evento conectado: ${mongoose.connection.name}`);
		});

		mongoose.connection.once('open', () => {
			console.log('MongoDB conexión abierta (evento open)');
		});

		await mongoose.connect(MONGODB_URI, {
			dbName: DEFAULT_DB,
		});

		// After connect resolves, show readyState for clarity (0 = disconnected, 1 = connected)
		console.log('MongoDB readyState:', mongoose.connection.readyState);

		mongoose.connection.on('error', (err: any) => {
			console.error('Error en la conexión a MongoDB:', err);
		});

		mongoose.connection.on('disconnected', () => {
			console.warn('MongoDB desconectado');
		});
	} catch (error) {
		console.error('No fue posible conectar a MongoDB:', error);
		process.exit(1);
	}
}

export default connectDB;

