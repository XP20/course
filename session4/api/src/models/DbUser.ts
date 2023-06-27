export interface DbUser {
    user_id: number;
    email: string;
    pass: string;
    is_verified: number;
    created: Date;
}