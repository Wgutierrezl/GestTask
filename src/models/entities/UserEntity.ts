export class UserEntity {
    nombre!: string
    correo!: string
    edad!: number
    contrasena!: string
    fechaRegistro: Date = new Date()
}