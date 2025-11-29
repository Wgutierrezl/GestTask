import { IhasherService } from './IHasherService';
import bcript from 'bcryptjs'

export class HasherService implements IhasherService{
    comparePassword(password: string, hashed: string): boolean {
        return bcript.compareSync(password,hashed);
    }
    
    encryptPassword(password: string): string {
        const saltRounds = 10;
        const hashedPassword = bcript.hashSync(password, saltRounds);
        return hashedPassword; 
    }

}