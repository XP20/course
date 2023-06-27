import {Body, Post, Route, Query} from "tsoa";
import {DbTodo} from "../models/DbTodo";

// import * as sha1 from 'js-sha1'; // not working here: 'TypeError: sha1 is not a function'
import {DatabaseService} from "../services/DatabaseService";
import {TodoUpdateBody} from "../models/TodoUpdateBody";

@Route("todos")
export class TodosController {
    @Post('add')
    public async TodoAdd(@Query() token: string, @Query() content: string): Promise<boolean> {
        let result = false;

        try {
            const conn = new DatabaseService;
            await conn.connect();
            let session = await conn.getSessionByToken(token);
            await conn.makeTodo(session.user_id, content);
        
            result = true;
        } catch(exc) {
            console.error(exc);
        }

        return result;
    }

    @Post('list')
    public async TodoList(@Query() token: string): Promise<DbTodo[]> {
        let todos: DbTodo[] = [];

        try {
            const conn = new DatabaseService;
            await conn.connect();
            let session = await conn.getSessionByToken(token);
            todos = await conn.getTodoByUserId(session.user_id);
        } catch(exc) {
            console.error(exc);
        }

        return todos;
    }

    @Post('remove')
    public async TodoRemove(@Query() token: string, @Query() todo_id: number): Promise<boolean> {
        let result = false;

        try {
            const conn = new DatabaseService;
            await conn.connect();
            let session = await conn.getSessionByToken(token);
            let todo = await conn.getTodoByTodoId(todo_id);
            if (todo.user_id == session.user_id) {
                await conn.deleteTodoByTodoId(todo_id);
                result = true;
            }
        } catch(exc) {
            console.error(exc);
        }

        return result;
    }

    @Post('update')
    public async TodoUpdate(@Query() token: string, @Query() todo_id, @Body() todo_body: TodoUpdateBody): Promise<boolean> {
        let result = false;

        try {
            const conn = new DatabaseService;
            await conn.connect();
            let session = await conn.getSessionByToken(token);
            let todo = await conn.getTodoByTodoId(todo_id);
            if (todo.user_id == session.user_id) {
                let title = todo_body.title;
                let completed = todo_body.completed;
                await conn.updateTodo(todo_id, title, completed);
                result = true;
            }
        } catch(exc) {
            console.error(exc);
        }

        return result;
    }
}