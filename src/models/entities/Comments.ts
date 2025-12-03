import { url } from "inspector";
import { Types, model,Schema } from "mongoose";


const archivosSchema = new Schema({
  nombre: { type: String, required: false },
  url: { type: String, required: false },
  tamaño: {type:Number, required:false}
}, { _id: true });



const comentarioSchema = new Schema({
    tareaId: { type: Types.ObjectId, ref: 'tareas', required: true },
    usuarioId: { type: Types.ObjectId, ref: 'usuarios', required: true },
    mensaje: { type: String, required: true },

    archivos: [{type: [archivosSchema], default : [] }],

    estado: {
        type: String,
        enum: ['activo', 'eliminado'],
        default: 'activo'
    },

    fechaCreacion: { type: Date, default: Date.now },
    fechaEdicion: { type: Date, default: null }
});

export const Comments=model('comentarios',comentarioSchema);
