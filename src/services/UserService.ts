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
import axios from "axios";
import { error } from "console";
import { Auth0UserInfoDTO } from "../models/DTOs/Auth0UserInfoDTO";
export class UserService implements IUserService{

    private readonly _repo:IUserRepository;
    private readonly _token:ITokenService;
    private readonly _hasher:IhasherService;

    constructor(repo:IUserRepository,token:ITokenService,hasher:IhasherService){
        this._repo=repo;
        this._token=token;
        this._hasher=hasher;
    }

    async loginOauth0(accessToken:string): Promise<SessionDTO> {
        /* let user=await this._repo.getUserByEmail(payload.email); */

        console.log(`token oauth0 : ${accessToken}`);

        //we access
        const userAuth0=await this.getUserInfoAuth0(accessToken);
        if(!userAuth0){
            throw new Error('no hemos logrado conseguir la informacion del usuario de oauth0');
        }

        console.log(`user sub : ${userAuth0.sub}`);
        console.log(`user name : ${userAuth0.name}`);
        console.log(`user email : ${userAuth0.email}`);

        if(!userAuth0.email){
            throw new Error("Usuario OAuth0 no tiene email");
        }

        let user=await this._repo.getUserByEmail(userAuth0.email);
        if(!user){
            const newUser=new UserEntity()
            newUser.nombre=userAuth0.name;
            newUser.correo=userAuth0.email;
            newUser.contrasena='';
            newUser.proveedorAuth='oauth0';
            newUser.oauth0Id=userAuth0.sub;
            newUser.edad=25,
            newUser.rol='usuario',
            newUser.fechaRegistro=new Date()

            user=await this._repo.createUser(newUser);
            console.log(`user created ${newUser}`);
        }


        if(user.oauth0Id && userAuth0.sub!==user.oauth0Id){
            throw new Error("no coincide el id del sub de oauth0 con el guardado en la bd");
        }

        const token=this._token.generateToken(user);
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
        console.log("Log the user correctly by the endpoint log");
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

    //METHOD TO GET THE USER INFO AUTH0
    private async getUserInfoAuth0(accessToken:string) : Promise<Auth0UserInfoDTO> {
        try{
            const response=await axios.get<Auth0UserInfoDTO>(`${process.env.OAUTH_DOMAIN}userinfo`,{
                headers:{
                    /* Authorization: `Bearer ${accessToken}` */
                    Authorization: `Bearer ${this.normalizeToken(accessToken)}`
                }    
            });

            console.log(`user info obtain ${response.data}`);
            return response.data;

        }catch(error:any){
            console.error(
                'Error obteniendo userinfo Auth0',
                error.response?.data || error.message
            );
            throw new Error('No se pudo obtener información del usuario Auth0');
        }
    }

    //METHOD TO NORMALICE THE TOKEN DELETE THE WORD BEARER
    private normalizeToken(token: string): string {
        return token.startsWith('Bearer ')
            ? token.replace(/^Bearer\s+/i, '')
            : token;
    }
    
}