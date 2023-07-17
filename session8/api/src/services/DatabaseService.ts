import {DataSource} from "typeorm";
import {DbUser} from "../models/DbUser";
import md5 from 'crypto-js/md5';

export class DatabaseService {
    constructor() {
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite",
            logging: false,
            synchronize: false,
            entities: [DbUser]
        });
    }

    //datasource
    private dataSource: DataSource;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async getUserByUsernameAndPass(username: string, password: string): Promise<DbUser> {
        let result: DbUser = {
            user_id: 0,
            username: '',
            password: '',
            photo_url: ''
        };

        try {
            let sha_pass = md5(password).toString();

            const userRepository = this.dataSource.getRepository(DbUser);
            result = await userRepository.findOneBy({
                username: username,
                password: sha_pass
            });
        } catch (e) {
            console.error(e);
        }

        return result;
    }
}
