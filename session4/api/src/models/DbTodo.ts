import {DbUser} from "./DbUser";

export interface DbTodo{
    todo_id: number;
    user_id: number;
    title: string;
    completed: number;
    created: Date;

    user?: DbUser;
}