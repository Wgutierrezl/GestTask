import { Schema,model } from "mongoose";

const userSchema = new Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    edad: { type: Number, required: true },
    contrasena: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date.now }
});


export const User = model('usuarios', userSchema);
