import {Application} from "express";
import express from "express";

import * as sha1 from "js-sha1";

import * as _ from "lodash";
import {RegisterRoutes} from "./routers/routes";
import swaggerUi from "swagger-ui-express";

// All APIs that need to be included must be imported in app.ts
import {DatabaseService} from "./services/DatabaseService";
import { NodemailerService } from "./services/NodemailerService";

const main = async () => {
    try {
        const PORT = 8000;
        const app: Application = express();

        app.use(express.json());
        app.use(express.static("public")); // from this directory you can load files directly

        RegisterRoutes(app);

        app.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                swaggerOptions: {
                    url: "/swagger.json",
                },
            }),
        );

        const conn = new DatabaseService;
        conn.connect();

        // Send email to user confirmation
        app.post('/user/register', async (req, res) => {
            let request = req.body;
            
            let email = request.email;
            let sha_pass = sha1(request.pass);

            let result = false;

            try {
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

            res.json(result);
        })

        // Get confirmation status
        app.get('/user/confirmation/:uuid', async (req, res) => {
            let result = 0;

            let user_id_str = req.params.uuid;
            
            try {
                let user_id = parseInt(user_id_str);
                
                let user = await conn.getUserByUserId(user_id);
                result = user.is_verified;
            } catch(exc) {
                console.error(exc);
            }
            
            res.json(result);
        })

        // Verify account
        app.get('/user/verify/:token', async (req, res) => {
            let result = false;

            let token = req.params.token;

            try {
                let verification = await conn.getVerificationByToken(token);
                await conn.verifyUser(verification.user_id);
                result = true;
            } catch(exc) {
                console.error(exc);
            }

            res.json(result);
        })
        
        // Login and get token
        app.post('/user/login', async (req, res) => {
            let result = '';

            let request = req.body;
            let email = request.email;
            let sha_pass = sha1(request.pass);

            try {
                let user = await conn.getUserByEmailAndPass(email, sha_pass);
                let token = await conn.makeSession(user.user_id);

                result = token;
            } catch(exc) {
                console.error(exc);
            }

            res.json(result);
        })

        app.post('/todos/add', (req, res) => {

        })

        app.post('/todos/list', (req, res) => {

        })

        app.post('/todos/remove', (req, res) => {

        })

        app.post('/todos/update', (req, res) => {

        })

        app.listen(PORT, () => {
            console.log('server running');
        })
    }
    catch (e) {
        console.log(e);
    }
}
main();