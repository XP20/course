export interface DbSession {
    token: string,
    user_id: number,
    created: Date,
    is_valid: boolean
}
