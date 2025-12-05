import { existsSync } from "fs";
import { Schema,Types,model } from "mongoose";


const EtapaSchema = new Schema({
  nombre: { type: String, required: true },
  orden: { type: Number, required: true }
}, { _id: true });

const pipelineSchema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
    tableroId: { type: Types.ObjectId, ref: 'tableros', required: true },
    etapas: { type: [EtapaSchema], default: [] },
    fechaCreacion: { type: Date, default: Date.now }
});


export const Pipeline = model('pipelines', pipelineSchema);