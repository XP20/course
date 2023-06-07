import { DataSource } from "typeorm";
import {DbUser} from "../models/db/DbUser";
//import sha1
import * as sha1 from "js-sha1";
import {DbSession} from "../models/db/DbSession";
import {v4 as uuidv4} from 'uuid';
import {OrmUser} from "../models/orm/OrmUser";
import {OrmSession} from "../models/orm/OrmSession";
import {OrmHabit} from "../models/orm/OrmHabit";
import {OrmHabitRecord} from "../models/orm/OrmHabitRecord";

export class ControllerDatabase {
    //singleton
    private static _instance: ControllerDatabase;
    private constructor() {
        //init litesql datasource
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite",
            logging: false,
            synchronize: false,
            entities: [
                OrmUser,
                OrmSession,
                OrmHabit,
                OrmHabitRecord
            ]
        })
    }

    public static get instance(): ControllerDatabase {
        if (!ControllerDatabase._instance) {
            ControllerDatabase._instance = new ControllerDatabase();
        }
        return ControllerDatabase._instance;
    }

    //datasource
    private dataSource: DataSource;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async loginOrm(
        email: string,
        pass: string
    ): Promise<OrmSession> {
        let session: OrmSession = null;
        let shaPass = sha1(pass);

        let user: OrmUser = await this.dataSource.manager.findOne(OrmUser, {
            where: {
                email: email,
                pass: shaPass
            }
        });

        if (user) {
            session = new OrmSession();
            session.user_id = user.user_id;
            session.token = uuidv4();
            session.is_valid = true;
            session.created = new Date();
            session.user = user;
            await this.dataSource.manager.save(session);

            session = await this.dataSource.manager.findOne(OrmSession, {
                where: {
                    session_id: session.session_id
                },
                relations: {
                    user: true
                }
            });

            console.log('A user logged in through ORM!');
        }

        return session;
    }

    public async login(
        email: string,
        pass: string
    ): Promise<DbSession> {
        let session: DbSession = null;
        let shaPass = sha1(pass);

        let query1 = 'SELECT * FROM users WHERE email = ? AND pass = ? AND is_deleted = 0';
        let params1 = [email, shaPass];
        let rows = await this.dataSource.query(query1, params1);
        
        if (rows.length > 0) {
            let user: DbUser = {
                user_id: rows[0].user_id,
                email: rows[0].email,
                pass: rows[0].pass,
                is_deleted: rows[0].is_deleted,
                created: rows[0].created
            };

            let sessionToken: string = uuidv4();

            let query2 = 'INSERT INTO sessions (user_id, token, is_valid) VALUES (?, ?, 1)';
            let params2 = [user.user_id, sessionToken];
            await this.dataSource.query(query2, params2);

            let rowLast = await this.dataSource.query('SELECT last_insert_rowid() as session_id');
            session = {
                session_id: rowLast[0].session_id,
                user_id: user.user_id,
                token: sessionToken,
                is_valid: true,
                created: new Date(),
                user: user
            };

            console.log('A user logged in through SQL!'); 
        }
       
        return session;
    }

    public async getHabits(
        session_token: string
    ): Promise<OrmHabit[]> {
        let habits: OrmHabit[] = [];
    
        let session = await this.dataSource.manager.findOne(OrmSession, {
            where: {
                token: session_token
            },
            relations: {
                user: true
            }
        });
        
        if (session) {
            habits = await this.dataSource.manager.find(OrmHabit, {
                where: {
                    user_id: session.user_id
                },
                relations: {
                    user: true
                }
            });
        }

        return habits;
    }
}