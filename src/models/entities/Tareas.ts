import {Schema, Types, model} from 'mongoose';
import { pipeline } from 'stream';


const tareaSchema = new Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    pipelineId: { type: Types.ObjectId, ref: 'pipelines', required: true },
    etapaId: { type: Types.ObjectId, required: true },
    asignadoA: { type: Types.ObjectId, ref: 'usuarios', required: true },
    priodidad: { type: String, enum: ['Baja', 'Media', 'Alta'], default: 'Media' },
    estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
    fechaCreacion: { type: Date, default: Date.now },
    fechaLimite: { type: Date, required: false },
    fechaFinalizacion: { type: Date, required: false },
    tableroId : {type: Types.ObjectId, ref: 'tableros' , required: true}
});

export const Tarea = model('tareas', tareaSchema);