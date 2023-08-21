import { Body, Controller, Post, Get, Route, FormField, Query, UploadedFile } from "tsoa";
import {ResponseLogin} from "../models/messages/ResponseLogin";
import {AddUser, GetSessionForUser, GetUserByUsernameAndHash} from "../services/ServiceDatabase";
import sha1 from "sha1";
import {ResponseRegister} from "../models/messages/ResponseRegister";
import {RequestRegister} from "../models/messages/RequestRegister";
import {RequestLogin} from "../models/messages/RequestLogin";

const REGISTER_FAIL_CODE = "Failed to register!";
const REGISTER_SUCCESS_CODE = "Success!";

@Route("user")
export class ControllerUser {
    @Post("login")
    public async Login(
        @Body() request_body: RequestLogin
    ): Promise<ResponseLogin> {
        let is_success = false;
        let session_token = "";

        let password = request_body.password;
        let username = request_body.username;

        let hash = sha1(password);
        let user = await GetUserByUsernameAndHash(username, hash);
        if (user.user_id !== 0) {
            let session = await GetSessionForUser(user);
            if (session.is_valid) {
                is_success = true;
                session_token = session.token;
            }
        }

        let response = {
            is_success: is_success,
            session_token: session_token
        } as ResponseLogin;

        return response;
    }

    @Post("register")
    public async Register(
        @Body() request_body: RequestRegister
    ): Promise<ResponseRegister> {
        let is_success: boolean;
        let code = REGISTER_FAIL_CODE;

        let password = request_body.password;
        let username = request_body.username;

        let hash = sha1(password);
        is_success = await AddUser(username, hash);

        if (is_success) {
            code = REGISTER_SUCCESS_CODE;
        }

        let response = {
            is_success: is_success,
            code: code
        } as ResponseRegister;

        return response;
    }
}
