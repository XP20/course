import {DbUser} from "./DbUser";

export interface DbSession{
    session_id: number;
    user_id: number;
    token: string;
    is_valid: number;
    created: Date;

    user?: DbUser;
}