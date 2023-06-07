export interface DbUser {
    user_id: number;
    email: string;
    pass: string;
    verified: number;
    created: Date;
}