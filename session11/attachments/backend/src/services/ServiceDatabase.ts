import sqlite3, {Database} from 'sqlite3'
import path from "path";
import {DbUser} from "../models/db/DbUser";
import {DbAttachment} from "../models/db/DbAttachment";
import { v4 as uuid } from "uuid";
import {DbSession} from "../models/db/DbSession";
import { open } from 'sqlite'

const DATABASE_PATH = path.join(__dirname, '../database.sqlite3');

const INSERT_ATTACHMENT = "INSERT INTO attachments(uuid, note, is_deleted) VALUES($uuid, $note, $is_deleted);";
const GET_USER = "SELECT * FROM users WHERE username=$username AND hash=$hash LIMIT 1;";
const INSERT_USER = "INSERT INTO users(username, hash) VALUES($username, $hash);";
const INSERT_SESSION = "INSERT INTO sessions(token, user_id, is_valid) VALUES($token, $user_id, $is_valid);";
const GET_SESSION = "SELECT * FROM sessions WHERE token=$token LIMIT 1;";

export async function GetUserByUsernameAndHash(username: string, hash: string): Promise<DbUser> {
    let user: DbUser = {
        user_id: 0,
        username: "",
        hash: "",
        created: new Date()
    };

    try {
        const db = await open({
            filename: DATABASE_PATH,
            driver: sqlite3.Database
        });
        let row = await db.get(GET_USER, {
            $username: username,
            $hash: hash
        });
        if (row) {
            user = row;
        }
    } catch (err) {
        console.error(err);
    }

    return user;
}

export async function AddUser(username: string, hash: string): Promise<boolean> {
    let is_success = false;

    try {
        const db = await open({
            filename: DATABASE_PATH,
            driver: sqlite3.Database
        });
        await db.run(INSERT_USER, {
            $username: username,
            $hash: hash
        });
        is_success = true;
    } catch (err) {
        console.error(err);
    }

    return is_success;
}

export async function GetSessionForUser(user: DbUser): Promise<DbSession> {
    let session: DbSession = {
        token: "",
        user_id: 0,
        created: new Date(),
        is_valid: false
    };

    try {
        const db = await open({
            filename: DATABASE_PATH,
            driver: sqlite3.Database
        });
        let token = uuid();
        let user_id = user.user_id;
        await db.run(INSERT_SESSION, {
            $token: token,
            $user_id: user_id,
            $is_valid: true
        });
        session = await GetSessionByToken(token);
    } catch (err) {
        console.error(err);
    }

    return session;
}

export async function GetSessionByToken(token: string): Promise<DbSession> {
    let session: DbSession = {
        token: "",
        user_id: 0,
        created: new Date(),
        is_valid: false
    };

    try {
        const db = await open({
            filename: DATABASE_PATH,
            driver: sqlite3.Database
        });
        let row = await db.get(GET_SESSION, {
            $token: token
        });
        if (row) {
            session = row;
        }
    } catch (err) {
        console.error(err);
    }

    return session;
}

export async function AddAttachment(attachment: DbAttachment): Promise<boolean> {
    let is_success = false;

    try {
        const db = await open({
            filename: DATABASE_PATH,
            driver: sqlite3.Database
        });
        await db.run(INSERT_ATTACHMENT, {
            $uuid: attachment.uuid,
            $note: attachment.note,
            $is_deleted: attachment.is_deleted
        });
        is_success = true;
    } catch (err) {
        console.error(err);
    }

    return is_success;
}
