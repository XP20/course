import {DbUser} from "./DbUser";

export interface DbVerification{
    verification_id: number;
    user_id: number;
    token: string;
    is_valid: number;
    created: Date;

    user?: DbUser;
}