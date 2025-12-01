import { Request,Response, NextFunction } from "express";
import jwt,{ JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request{
    /* user?: JwtPayload | string; */
    user?:{
        id:string;
        email:string;
        name:string;
        role:string;
    }
}


// allowedRoles: lista de roles permitidos
export const authMiddleware = (allowedRoles: string[] = []) => {
    return(req:AuthRequest, res:Response, next: NextFunction)=>{
        const authHeader=req.headers['authorization'];
        const token=authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({message:"No token provided"});
        }

        try{
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                return res.status(500).json({ message: "JWT_SECRET is not configured" });
            }
            
            const decoded = jwt.verify(token, secret) as {
                id:string;
                email:string;
                name:string;
                role:string;
            };

            req.user = decoded;

            if(allowedRoles.length>0 && !allowedRoles.includes(decoded.role)){
                return res.status(403).json({message:"Access denied"});
            }

            next();

        }catch(err){
            return res.status(403).json({message: "Invalid token"})
        }

    }
}