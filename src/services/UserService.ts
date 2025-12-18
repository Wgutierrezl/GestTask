import { IUserService } from "../interfaces/iUser/IUserService";
import { LoginDTO } from "../models/DTOs/LoginDTO";
import { UserDTO } from "../models/DTOs/UserDTO";
import { UserInfoDTO } from "../models/DTOs/UserInfoDTO";
import { IUserRepository } from "../interfaces/iUser/IUserRepository";
import { UserEntity } from "../models/entities/UserEntity";
import { IhasherService } from "../custom/IHasherService";
import { ITokenService } from "../custom/ITokenService";
import { SessionDTO } from "../models/DTOs/SessionDTO";
import { Payload } from "../models/DTOs/Payload";

export class UserService implements IUserService{

    private readonly _repo:IUserRepository;
    private readonly _token:ITokenService;
    private readonly _hasher:IhasherService;

    constructor(repo:IUserRepository,token:ITokenService,hasher:IhasherService){
        this._repo=repo;
        this._token=token;
        this._hasher=hasher;
    }

    async loginOauth0(payload:Payload): Promise<SessionDTO> {
        let user=await this._repo.getUserByEmail(payload.email);
        if(!user){
            const newUser=new UserEntity()
            newUser.nombre=payload.nombre;
            newUser.correo=payload.email;
            newUser.contrasena='';
            newUser.proveedorAuth='oauth0';
            newUser.oauth0Id=payload.oauth0Id;
            newUser.edad=25,
            newUser.rol='admin',
            newUser.fechaRegistro=new Date()

            user=await this._repo.createUser(newUser);
            console.log(`user created ${newUser}`);
        }

        const token=await this._token.generateToken(user);
        console.log(`token generated ${token}`);

        return {
            userId:user._id,
            nombre:user.nombre,
            token:token,
            rol:user.rol
        }
    }
    
    async getAllUsers(): Promise<UserInfoDTO | null> {
        const response=await this._repo.getAllUsers();
        if(response.length==0 || response==null){
            return null;
        }

        return response;
    }

    async createUser(user: UserDTO): Promise<UserInfoDTO> {
        const userData=new UserEntity();

        const passwordHash=this._hasher.encryptPassword(user.contrasena);

        userData.nombre=user.nombre;
        userData.correo=user.correo;
        userData.edad=user.edad;
        userData.contrasena=passwordHash;
        userData.rol=user.rol;


        const saved=await this._repo.createUser(userData);
        console.log("UserCreated",saved);
        
        /* return {
            nombre:saved.nombre,
            correo:saved.correo,
            edad:saved.edad,
            contrasena:undefined as any
        }; */

        return saved;
    }


    async login(loginDTO: LoginDTO): Promise<SessionDTO | null> {
        const user=await this._repo.getUserByEmail(loginDTO.email);
        console.log("User found",user);
        if(user==null){
            return null;
        }

        const valid=this._hasher.comparePassword(loginDTO.password, user.contrasena);
        if(!valid){
            throw new Error("Credenciales inválidas");
        }

        const token=this._token.generateToken(user);

        const Session=new SessionDTO();
        Session.userId=user._id;
        Session.nombre=user.nombre;
        Session.token=token;
        Session.rol=user.rol;
        
        return Session;

    }


    async getUserById(id: string): Promise<UserInfoDTO | null> {
        const user=await this._repo.getUserById(id);
        if(user==null){
            return null;
        }

        return {
            _id:user._id,
            nombre:user.nombre,
            correo:user.correo,
            edad:user.edad,
            contrasena:undefined as any,
            rol:user.rol
        };

    }
    
}