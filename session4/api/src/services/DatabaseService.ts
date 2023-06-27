import {DataSource} from "typeorm";

import {DbVerification} from "../models/DbVerification";
import {DbUser} from "../models/DbUser";
import {DbSession} from "../models/DbSession";
import {DbTodo} from "../models/DbTodo";

//import * as sha1 from 'js-sha1'; // not working here: 'TypeError: sha1 is not a function'
import {v4 as uuidv4} from 'uuid';

export class DatabaseService {
    constructor() {
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "./database.sqlite",
            logging: false,
            synchronize: false,
            entities: []
        });
    }

    //datasource
    private dataSource: DataSource;

    public async connect(): Promise<void> {
        await this.dataSource.initialize();
    }

    public async getUserByEmailAndPass(email: string, sha_pass: string): Promise<DbUser> {
        let user: DbUser = {
            user_id: null,
            email: null,
            pass: null,
            is_verified: null,
            created: null,
        };

        let user_sql = 'SELECT * FROM users WHERE email = :email AND pass = :pass LIMIT 1';
        let values = {email: email, pass: sha_pass};
        let rows = await this.dataSource.manager.query(user_sql, values as any);

        if (rows.length > 0) {
            let row = rows[0];
            user.user_id = row.user_id;
            user.email = row.email;
            user.pass = row.pass;
            user.is_verified = row.is_verified;
            user.created = row.created;
        }

        return user;
    }

    public async getUserByUserId(user_id: number): Promise<DbUser> {
        let user: DbUser = {
            user_id: null,
            email: null,
            pass: null,
            is_verified: null,
            created: null,
        };

        let user_sql = 'SELECT * FROM users WHERE user_id = :user_id LIMIT 1';
        let values = {user_id: user_id};
        let rows = await this.dataSource.manager.query(user_sql, values as any);

        if (rows.length > 0) {
            let row = rows[0];
            user.user_id = row.user_id;
            user.email = row.email;
            user.pass = row.pass;
            user.is_verified = row.is_verified;
            user.created = row.created;
        }

        return user;
    }

    public async getUserIdByEmail(email: string): Promise<number> {
        let user_id = null;

        let user_id_sql = 'SELECT user_id FROM users WHERE email = :email';
        let values = {email: email};
        let rows = await this.dataSource.query(user_id_sql, values as any);
        if (rows.length > 0) {
            let row = rows[0];
            user_id = row.user_id;
        }

        return user_id;
    }

    public async getVerificationByToken(token: string): Promise<DbVerification> {
        let verification: DbVerification = {
            user_id: null,
            verification_id: null,
            token: null,
            is_valid: null,
            created: null
        };

        let token_sql = 'SELECT * FROM verifications WHERE token = :token AND is_valid = 1 LIMIT 1;';
        let values = {token};
        let rows = await this.dataSource.query(token_sql, values as any);
    
        if (rows.length > 0) {
            let row = rows[0];
            verification.user_id = row.user_id;
            verification.verification_id = row.verification_id;
            verification.token = row.token;
            verification.is_valid = row.is_valid;
            verification.created = row.created;
        }

        return verification;
    }

    public async registerUser(email: string, sha_pass: string): Promise<void> {
        let user_sql = 'INSERT INTO users(email, pass) VALUES(:email, :pass)';
        let values = {email: email, pass: sha_pass};
        await this.dataSource.manager.query(user_sql, values as any);
    }

    public async verifyUser(user_id: number): Promise<void> {
        let update_sql = 'UPDATE users SET verified = 1 WHERE user_id = :user_id';
        let values = {user_id: user_id}
        await this.dataSource.query(update_sql, values as any);
    }

    public async deleteVerification(verification_id: number): Promise<void> {
        let delete_sql = 'DELETE FROM verifications WHERE verification_id = :verification_id';
        let values = {verification_id: verification_id}
        await this.dataSource.query(delete_sql, values as any);
    }

    public async makeVerification(user_id: number): Promise<string> {
        let token = uuidv4();
        let make_verification_sql = 'INSERT INTO verifications(user_id, token) VALUES (:user_id, :token)';
        let values = {user_id: user_id, token: token};
        await this.dataSource.query(make_verification_sql, values as any);

        return token;
    }

    public async makeSession(user_id: number): Promise<string> {
        let token = uuidv4();
        let session_sql = 'INSERT INTO sessions(user_id, token) VALUES (:user_id, :token)';
        let values = {user_id: user_id, token: token}
        await this.dataSource.manager.query(session_sql, values as any);

        return token;
    }

    public async getSessionByToken(token: string): Promise<DbSession> {
        let session: DbSession = {
            session_id: null,
            user_id: null,
            token: null,
            is_valid: null,
            created: null
        };
        
        let get_session_sql = 'SELECT * FROM sessions WHERE token = :token LIMIT 1';
        let values = {token: token};
        let session_rows = await this.dataSource.manager.query(get_session_sql, values as any);

        if (session_rows.length > 0) {
            let session_row = session_rows[0];
            session.session_id = session_row.session_id;
            session.user_id = session_row.user_id;
            session.token = session_row.token;
            session.is_valid = session_row.is_valid;
            session.created = session_row.created;
        }

        return session;
    }

    public async makeTodo(user_id: number, title: string): Promise<void> {
        let todo_sql = 'INSERT INTO todo(user_id, title) VALUES (:user_id, :title)';
        let values = {user_id: user_id, title: title};
        await this.dataSource.manager.query(todo_sql, values as any);
    }

    public async getTodoByUserId(user_id: number): Promise<DbTodo[]> {
        let todos: DbTodo[] = [];

        let todo_sql = 'SELECT * FROM todo WHERE user_id = :user_id';
        let values = {user_id: user_id}
        let todo_rows = await this.dataSource.manager.query(todo_sql, values as any);

        for (let i = 0; i < todo_rows.length; i++) {
            let todo_row = todo_rows[0];
            let todo: DbTodo = {
                todo_id: todo_row.todo_id,
                user_id: todo_row.user_id,
                title: todo_row.title,
                completed: todo_row.completed,
                created: todo_row.created
            };

            todos.push(todo);
        }

        return todos;
    }

    public async getTodoByTodoId(todo_id: number): Promise<DbTodo> {
        let todo: DbTodo = {
            todo_id: null,
            user_id: null,
            title: null,
            created: null,
            completed: null
        };

        let todo_sql = 'SELECT * FROM todo WHERE todo_id = :todo_id';
        let values = {todo_id: todo_id};
        let todo_rows = await this.dataSource.manager.query(todo_sql, values as any);

        if (todo_rows.length > 0) {
            let todo_row = todo_rows[0];
            todo.todo_id = todo_row.todo_id;
            todo.user_id = todo_row.user_id;
            todo.completed = todo_row.completed;
            todo.created = todo_row.created;
            todo.title = todo_row.title;
        }

        return todo;
    }

    public async deleteTodoByTodoId(todo_id: number): Promise<void> {
        let todo_sql = 'DELETE FROM todo WHERE todo_id = :todo_id';
        let values = {todo_id: todo_id};
        await this.dataSource.manager.query(todo_sql, values as any);
    }

    public async updateTodo(todo_id: number, title: string, completed: number): Promise<void> {
        let update_sql = 'UPDATE todo SET title = :title, completed = :completed WHERE todo_id = :todo_id';
        let values = {title: title, completed: completed, todo_id: todo_id};
        await this.dataSource.manager.query(update_sql, values as any);
    }
}