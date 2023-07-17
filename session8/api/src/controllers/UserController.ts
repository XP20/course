import {DatabaseService} from "../services/DatabaseService";
import {DbUser} from "../models/DbUser";

export class UserController {
    public async Login(username: string, password: string): Promise<DbUser> {
        let user: DbUser = {
            user_id: 0,
            username: '',
            password: '',
            photo_url: ''
        };

        try {
            const conn = new DatabaseService;
            await conn.connect();
            user = await conn.getUserByUsernameAndPass(username, password);
            if (user) {
                user.password = '';
            }
        } catch(e) {
            console.error(e);
        }

        return user;
    }
}
