import sqlite3 from 'sqlite3'
import path from "path";
import {DbUser} from "../models/db/DbUser";
import {v4 as uuid} from "uuid";
import {DbSession} from "../models/db/DbSession";
import {open} from 'sqlite'
import {DbListing} from "../models/db/DbListing";

const DATABASE_PATH = path.join(__dirname, '../database.sqlite3');

const GET_USER = "SELECT * FROM users WHERE username=$username AND hash=$hash LIMIT 1;";
const GET_SESSION = "SELECT * FROM sessions WHERE token=$token LIMIT 1;";
const INSERT_USER = "INSERT INTO users(username, hash) VALUES($username, $hash);";
const INSERT_SESSION = "INSERT INTO sessions(token, user_id, is_valid) VALUES($token, $user_id, $is_valid);";
const INSERT_LISTING = "INSERT INTO listings(make, year, mileage, description, price, user_id, is_deleted) VALUES($make, $year, $mileage, $description, $price, $user_id, $is_deleted);";
const GET_LAST_ID = "SELECT last_insert_rowid() AS id";
const GET_LISTING = "SELECT * FROM listings WHERE list_id=$list_id LIMIT 1;";

export async function GetUserByUsernameAndHash(username: string, hash: string): Promise<DbUser> {
    let user = {
        user_id: 0,
        username: "",
        hash: "",
        created: new Date()
    } as DbUser;

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
    let session = {
        token: "",
        user_id: 0,
        created: new Date(),
        is_valid: false
    } as DbSession;

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
    let session = {
        token: "",
        user_id: 0,
        created: new Date(),
        is_valid: false
    } as DbSession;

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

export async function AddListing(listing: DbListing): Promise<number> {
    let list_id = 0;

    try {
        const db = await open({
            filename: DATABASE_PATH,
            driver: sqlite3.Database
        });
        await db.run(INSERT_LISTING, {
            $make: listing.make,
            $year: listing.year,
            $mileage: listing.mileage,
            $description: listing.description,
            $price: listing.price,
            $user_id: listing.user_id,
            $is_deleted: listing.is_deleted
        });
        const lastIdRow = await db.get(GET_LAST_ID);
        list_id = lastIdRow.id;
    } catch (err) {
        console.error(err);
    }

    return list_id;
}

export async function GetListingById(list_id: number): Promise<DbListing> {
    let result = {
        list_id: 0,
        make: "",
        year: 0,
        mileage: 0,
        description: "",
        price: 0,
        created: new Date(),
        user_id: 0,
        is_deleted: true
    } as DbListing;

    try {
        const db = await open({
            filename: DATABASE_PATH,
            driver: sqlite3.Database
        });
        let row = await db.get(GET_LISTING, {
            $list_id: list_id
        });
        if (row) {
            result = row;
        }
    } catch (err) {
        console.error(err);
    }

    return result;
}
