import {singleton} from 'tsyringe';
import {DataSource} from "typeorm";

import {DbVerification} from "../models/DbVerification";
import {DbUser} from "../models/DbUser";
import {DbSession} from "../models/DbSession";
import {DbTodo} from "../models/DbTodo";

// import * as sha1 from 'js-sha1'; // not working here: 'TypeError: sha1 is not a function'
import nodemailer from "nodemailer";
import {v4 as uuidv4} from 'uuid';
import { TodoUpdateBody } from '../models/TodoUpdateBody';

@singleton()
export class DatabaseService {
    constructor() {
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite",
            logging: false,
            synchronize: false,
            entities: []
        });

        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'source@gmail.com',
                pass: 'passphrase'
            }
        });
    }

    //datasource
    private dataSource: DataSource;
    private transporter;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async VerifyEmail(tokenDirty: string): Promise<{success: boolean}> {
        let success = false;

        let token = tokenDirty.trim();
        
        // Check if token is valid
        let tokenSql = 'SELECT * FROM verifications WHERE token = ? AND is_valid = 1 LIMIT 1;';
        let rows = await this.dataSource.query(tokenSql, [token]);
    
        if (rows.length > 0) {
            success = true;
            
            let verification: DbVerification = {
                user_id: rows[0].user_id,
                verification_id: rows[0].verification_id,
                token: rows[0].token,
                is_valid: rows[0].is_valid,
                created: rows[0].created
            };
    
            // Update user to be verified
            let user_id = verification.user_id;
            let udpateSql = 'UPDATE users SET verified = 1 WHERE user_id = ?';
            await this.dataSource.query(udpateSql, [user_id]);
            
            // Delete verification entry
            let verification_id = verification.verification_id;
            let deleteSql = 'DELETE FROM verifications WHERE verification_id = ?';
            await this.dataSource.query(deleteSql, [verification_id]);
        }
    
        return {success: success};
    }

    public async Register(emailDirty: string, shaPass: string): Promise<{success: boolean}> {
        let success = false;
        
        let email = emailDirty.trim();
        let pass = shaPass.trim();

        // Making the user entry
        let userSql = 'INSERT INTO users(email, pass) VALUES(?, ?)';
        await this.dataSource.query(userSql, [email, pass]);

        // Getting user id
        let userIdSql = 'SELECT user_id FROM users WHERE email = ?';
        let rows = await this.dataSource.query(userIdSql, [email]);
        if (rows.length > 0) {
            let user_id = rows[0].user_id;

            // Making the verification entry
            let token = uuidv4();
            let verifySql = 'INSERT INTO verifications(user_id, token) VALUES (?, ?)';
            await this.dataSource.query(verifySql, [user_id, token])
    
            // SMTP Sending the verification email
            let html = `<div><h>Test Html Header</h><p>Go to this link to verify: http://127.0.0.1:8000/user/verify/${token}</p></div>`;
    
            let result = await this.transporter.sendMail({
                from: 'source@gmail.com',
                to: email,
                subject: 'Test email',
                html: html,
            });

            success = true;
        }        

        return {success: success};
    }

    public async Confirmation(user_id: number): Promise<{success: boolean, verified: number}> {
        let response = {
            success: false,
            verified: 0
        };

        // Getting user by user_id
        let userIdSql = 'SELECT * FROM users WHERE user_id = ? LIMIT 1';
        let rows = await this.dataSource.manager.query(userIdSql, [user_id]);
        
        if (rows.length > 0) {
            let user: DbUser = {
                user_id: rows[0].user_id,
                email: rows[0].email,
                pass: rows[0].pass,
                verified: rows[0].verified,
                created: rows[0].created
            };

            response.success = true;
            response.verified = user.verified;
        }

        return response;
    }

    public async Login(emailDirty: string, shaPass: string): Promise<{success: boolean, token: string}> {
        let response = {
            success: false,
            token: ''
        };

        let email = emailDirty.trim();
        let pass = shaPass.trim();

        // Getting user_id
        let userSql = 'SELECT * FROM users WHERE email = ? AND pass = ? LIMIT 1';
        let rows = await this.dataSource.manager.query(userSql, [email, pass]);

        if (rows.length > 0) {
            let user: DbUser = {
                user_id: rows[0].user_id,
                email: rows[0].email,
                pass: rows[0].pass,
                verified: rows[0].verified,
                created: rows[0].created,
            };
            
            // Creating a session
            let token = uuidv4();
            let sessionSql = 'INSERT INTO sessions(user_id, token) VALUES (?, ?)';
            await this.dataSource.manager.query(sessionSql, [user.user_id, token]);

            // Get the created session
            let getSessionSql = 'SELECT * FROM sessions WHERE token = ? LIMIT 1';
            let sessionRows = await this.dataSource.manager.query(getSessionSql, [token]);

            if (sessionRows.length > 0) {
                let session: DbSession = {
                    session_id: sessionRows[0].session_id,
                    user_id: sessionRows[0].user_id,
                    token: sessionRows[0].token,
                    is_valid: sessionRows[0].is_valid,
                    created: sessionRows[0].created
                };

                response.success = true   
                response.token = session.token;
            }
        }

        return response;
    }
    
    public async TodoAdd(tokenDirty: string, contentDirty: string): Promise<{success: boolean}> {
        let success = false;

        let token = tokenDirty.trim();

        let tokenSql = 'SELECT * FROM sessions WHERE token = ? LIMIT 1';
        let rows = await this.dataSource.manager.query(tokenSql, [token]);

        if (rows.length > 0) {
            let session: DbSession = {
                session_id: rows[0].session_id,
                user_id: rows[0].user_id,
                token: rows[0].token,
                is_valid: rows[0].is_valid,
                created: rows[0].created
            };

            let user_id = session.user_id;

            let content = contentDirty.trim();
            
            let todoSql = 'INSERT INTO todo(user_id, value) VALUES (? ,?)';
            await this.dataSource.manager.query(todoSql, [user_id, content]);

            success = true;
        }

        return {success: success};
    }

    public async TodoList(tokenDirty: string): Promise<{success: boolean, todos: DbTodo[]}> {
        let success = false;
        let todos: DbTodo[] = [];

        let token = tokenDirty.trim();

        let tokenSql = 'SELECT * FROM sessions WHERE token = ? LIMIT 1';
        let rows = await this.dataSource.manager.query(tokenSql, [token]);

        if (rows.length > 0) {
            let session: DbSession = {
                session_id: rows[0].session_id,
                user_id: rows[0].user_id,
                token: rows[0].token,
                is_valid: rows[0].is_valid,
                created: rows[0].created
            };

            let user_id = session.user_id;
            
            let todoSql = 'SELECT * FROM todo WHERE user_id = ?';
            let todoRows = await this.dataSource.manager.query(todoSql, [user_id]);

            for (let i = 0; i < todoRows.length; i++) {
                let todo: DbTodo = {
                    todo_id: todoRows[0].todo_id,
                    user_id: todoRows[0].user_id,
                    value: todoRows[0].value,
                    completed: todoRows[0].completed,
                    created: todoRows[0].created
                };

                todos.push(todo);
            }

            success = true;
        }

        return {success: success, todos: todos};
    }

    public async TodoRemove(tokenDirty: string, todo_idDirty: string): Promise<{success: boolean}> {
        let success = false;

        let token = tokenDirty.trim();

        let tokenSql = 'SELECT * FROM sessions WHERE token = ? LIMIT 1';
        let rows = await this.dataSource.manager.query(tokenSql, [token]);

        if (rows.length > 0) {
            let session: DbSession = {
                session_id: rows[0].session_id,
                user_id: rows[0].user_id,
                token: rows[0].token,
                is_valid: rows[0].is_valid,
                created: rows[0].created
            };

            let todo_idString = todo_idDirty.trim();
            let todo_id = parseInt(todo_idString);

            let user_id = session.user_id;
            
            let todoSql = 'DELETE FROM todo WHERE user_id = ? AND todo_id = ?';
            await this.dataSource.manager.query(todoSql, [user_id, todo_id]);

            success = true;
        }

        return {success: success};
    }

    public async TodoUpdate(tokenDirty: string, todo_id: number, newValues: TodoUpdateBody): Promise<{success: boolean}> {
        let success = false;

        let token = tokenDirty.trim();

        let tokenSql = 'SELECT * FROM sessions WHERE token = ? LIMIT 1';
        let rows = await this.dataSource.manager.query(tokenSql, [token]);

        if (rows.length > 0) {
            let session: DbSession = {
                session_id: rows[0].session_id,
                user_id: rows[0].user_id,
                token: rows[0].token,
                is_valid: rows[0].is_valid,
                created: rows[0].created
            };

            let user_id = session.user_id;
            
            let todoSql = 'SELECT * FROM todo WHERE todo_id = ? AND user_id = ? LIMIT 1';
            let todoRows = await this.dataSource.manager.query(todoSql, [todo_id, user_id]);

            if (todoRows.length > 0) {
                let todo: DbTodo = {
                    todo_id: todoRows[0].todo_id,
                    user_id: todoRows[0].user_id,
                    value: todoRows[0].value,
                    completed: todoRows[0].completed,
                    created: todoRows[0].created
                };

                if (newValues.contentDirty != null) {
                    let content = newValues.contentDirty.trim();

                    todo.value = content;
                }

                if (newValues.completed != null) {
                    let completed = newValues.completed;

                    todo.completed = completed;
                }

                let updateSql = 'UPDATE todo SET value = ?, completed = ? WHERE user_id = ? AND todo_id = ?';
                let updateArgs = [todo.value, todo.completed, user_id, todo_id];
                await this.dataSource.manager.query(updateSql, updateArgs);

                success = true;
            }
        }

        return {success: success};
    }
}