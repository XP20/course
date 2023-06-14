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

@Route("user")
export class UserController {
    private db: DatabaseService = container.resolve(DatabaseService);

    constructor() {
        this.db = container.resolve(DatabaseService);
    }

    @Get("verify/{token}")
    public async VerifyEmail(@Path() token: string): Promise<{success: boolean}> {
        let result = await this.db.VerifyEmail(token);
        return result;
    }

    @Post('register')
    public async Register(@Query() emailDirty: string, @Query() shaPass: string): Promise<{success: boolean}> {
        let result = await this.db.Register(emailDirty, shaPass);
        return result;
    }

    @Get('confirmation/{user_id}')
    public async Confirmation(@Path() user_id: number): Promise<{success: boolean, verified: number}> {
        let result = await this.db.Confirmation(user_id);
        return result;
    }

    @Post('login')
    public async Login(@Query() emailDirty: string, @Query() shaPass: string): Promise<{success: boolean, token: string}> {
        let result = await this.db.Login(emailDirty, shaPass);
        return result;
    }
}