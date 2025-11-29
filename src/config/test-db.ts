import connectDB from './config-mongodb';

async function main() {
  try {
    await connectDB();
    console.log('Verificación: conexión a la base de datos `task_db` exitosa.');
    process.exit(0);
  } catch (error) {
    console.error('Verificación fallida:', error);
    process.exit(1);
  }
}

main();
