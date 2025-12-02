import { existsSync } from "fs";
import { Schema,Types,model } from "mongoose";
import { ref } from "process";


const boardsSchema=new Schema({
    nombre: {type:String , required: true},
    descripcion : {type: String, required: true},
    ownerId: {type: Types.ObjectId, ref : 'usuarios' ,required: true},
    miembros: [{type: Types.ObjectId, ref:'usuarios' , required: true}],
    pipelines : [{type: Types.ObjectId , ref:'pipelines', required:false}],
    fechaCreacion : {type: Date , default: Date.now },
    estado: {type: String, enum:['activo','inactivo'], default : 'activo', required: true}
});

export const Board=model('tableros', boardsSchema);