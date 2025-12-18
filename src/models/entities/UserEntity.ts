export class UserEntity {
    nombre!: string
    correo!: string
    edad!: number
    contrasena?: string
    proveedorAuth?:string
    oauth0Id?:string
    fechaRegistro: Date = new Date()
    rol!: string
}