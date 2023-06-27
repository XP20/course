import {Post, Get, Route, Query, Path} from "tsoa";

// import * as sha1 from 'js-sha1'; // not working here: 'TypeError: sha1 is not a function'
import {DatabaseService} from "../services/DatabaseService";
import { NodemailerService } from "../services/NodemailerService";

@Route("user")
export class UserController {
    @Get("verify/{token}")
    public async VerifyEmail(@Path() token: string): Promise<boolean> {
        let result = false;

        try {
            const conn = new DatabaseService;
            await conn.connect();
            let verification = await conn.getVerificationByToken(token);
            let user_id = verification.user_id;
            await conn.verifyUser(user_id);
            result = true;
        } catch(exc) {
            console.error(exc);
        }

        return result;
    }

    @Post('register')
    public async Register(@Query() email: string, @Query() sha_pass: string): Promise<boolean> {
        let result = false;

        try {
            const conn = new DatabaseService;
            await conn.connect();
            await conn.registerUser(email, sha_pass);
            let user = await conn.getUserByEmailAndPass(email, sha_pass);
            let token = await conn.makeVerification(user.user_id);
            
            let html = `<div><h>Test HTML Header</h><p>Go to this link to verify: https://127.0.0.1:8000/user/verify/${token}</p></div>`;
            let subject = 'Test register email';
            let target = email;

            const nodemailer = new NodemailerService;
            nodemailer.sendEmail(html, subject, target);

            result = true;
        } catch(exc) {
            console.error(exc);
        }

        return result;
    }

    @Get('confirmation/{user_id}')
    public async Confirmation(@Path() user_id: number): Promise<number> {
        let result = 0;

        try {
            const conn = new DatabaseService;
            await conn.connect();
            let user = await conn.getUserByUserId(user_id);
            result = user.is_verified;
        } catch(exc) {
            console.error(exc);
        }

        return result;
    }

    @Post('login')
    public async Login(@Query() email: string, @Query() sha_pass: string): Promise<string> {
        let result = '';

        try {
            const conn = new DatabaseService;
            await conn.connect();
            let user = await conn.getUserByEmailAndPass(email, sha_pass);
            let token = await conn.makeSession(user.user_id);
            result = token;
        } catch(exc) {
            console.error(exc);
        }

        return result;
    }
}