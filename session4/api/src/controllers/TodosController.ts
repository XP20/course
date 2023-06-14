import {Body, Controller, Post, Get, Route, Query, Path} from "tsoa";
import {container} from 'tsyringe';
import {DataSource} from "typeorm";

import {DbVerification} from "../models/DbVerification";
import {DbUser} from "../models/DbUser";
import {DbSession} from "../models/DbSession";
import {DbTodo} from "../models/DbTodo";

// import * as sha1 from 'js-sha1'; // not working here: 'TypeError: sha1 is not a function'
import nodemailer from "nodemailer";
import {v4 as uuidv4} from 'uuid';
import {DatabaseService} from "../services/DatabaseService";
import { TodoUpdateBody } from "../models/TodoUpdateBody";

@Route("todos")
export class TodosController {
    private db: DatabaseService = container.resolve(DatabaseService);

    constructor() {
        this.db = container.resolve(DatabaseService);
    }

    @Post('add')
    public async TodoAdd(@Query() token: string, @Query() content: string): Promise<{success: boolean}> {
        let result = await this.db.TodoAdd(token, content);
        return result;
    }

    @Post('list')
    public async TodoList(@Query() token: string): Promise<{success: boolean, todos: DbTodo[]}> {
        let result = await this.db.TodoList(token);
        return result;
    }

    @Post('remove')
    public async TodoRemove(@Query() token: string, @Query() todo_id: string): Promise<{success: boolean}> {
        let result = await this.db.TodoRemove(token, todo_id);
        return result;
    }

    @Post('update')
    public async TodoUpdate(@Query() token: string, @Query() todo_id, @Body() todoBody: TodoUpdateBody): Promise<{success: boolean}> {
        let result = await this.db.TodoUpdate(token, todo_id, todoBody);
        return result;
    }
}