import { Schema,model } from "mongoose";

const userSchema = new Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    edad: { type: Number, required: true },
    contrasena: { type: String, required: false },
    proveedorAuth: {type: String, enum:['local','oauth0'], default:'local'},
    oauth0Id: {type:String, require: false},
    fechaRegistro: { type: Date, default: Date.now },
    rol: {type: String, required: true}
});


export const User = model('usuarios', userSchema);
