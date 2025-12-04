import { model, Schema, Types } from "mongoose";

const tableroUsuarioSchema = new Schema({
    tableroId: { type: Types.ObjectId, ref: 'tableros', required: true },
    usuarioId: { type: Types.ObjectId, ref: 'usuarios', required: true },

    rol: {
        type: String,
        enum: ['owner', 'miembro', 'invitado'],
        required: true
    },

    fechaIngreso: { type: Date, default: Date.now }
});

// Un usuario no puede estar dos veces en el mismo tablero
tableroUsuarioSchema.index({ tableroId: 1, usuarioId: 1 }, { unique: true });

export const TableroUsuario = model('tablero_usuarios', tableroUsuarioSchema);