import { Response, NextFunction } from "express";
import { TableroUsuario } from "../models/entities/BoardsUsers";
import { AuthRequest } from "../middleware/genericMiddleware"; // importa tu interfaz

export const requireBoardRole = (allowedRoles: string[] = []) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const tableroId = req.params.tableroId;

            if (!userId) return res.status(401).json({ message: "Usuario no autenticado" });
            if (!tableroId) return res.status(400).json({ message: "Falta el ID del tablero" });

            const miembro = await TableroUsuario.findOne({
                usuarioId: userId,
                tableroId: tableroId
            });

            if (!miembro) return res.status(403).json({ message: "No perteneces a este tablero" });

            if (!allowedRoles.includes(miembro.rol)) {
                return res.status(403).json({ message: "No tienes permiso para esta acción" });
            }

            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}
