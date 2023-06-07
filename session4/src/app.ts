import {Application, application} from "express";
import express from "express";
import moment from "moment";

import cluster from "cluster";
import os from "os";

import * as sha1 from "js-sha1";

import nodemailer from "nodemailer";
import fs from "fs";
import * as _ from "lodash";
import {RegisterRoutes} from "./routers/routes";
import swaggerUi from "swagger-ui-express";

import sqlite3 from "sqlite3";
import { open } from "sqlite";

import {v4 as uuidv4} from "uuid";

// All APIs that need to be included must be imported in app.ts
import {DatabaseService} from "./services/DatabaseService";
import {UserController} from "./controllers/UserController";
import {TodosController} from "./controllers/TodosController";
import {container} from "tsyringe";

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

        const db = container.resolve(DatabaseService);
        db.connect();

        // Send email to user confirmation
        app.post('/user/register', async (req, res) => {
            let request = req.body;
            
            let email = request.email;
            let shaPass = sha1(request.pass);
            let response = await db.Register(email, shaPass);

            res.json(response);
        })

        // Get confirmation status
        app.get('/user/confirmation/:uuid', async (req, res) => {
            let response = {
                success: false,
                verified: 0
            };

            let uuidStr = req.params.uuid;
            
            try {
                let uuid = parseInt(uuidStr);
                response = await db.Confirmation(uuid);
            } catch(e) {
                console.log(e);
            }
            
            res.json(response);
        })

        // Verify account
        app.get('/user/verify/:token', async (req, res) => {
            let response = {
                success: false
            }

            let token = req.params.token;
            response = await db.VerifyEmail(token);

            res.json(response);
        })
        
        // Login and get token
        app.post('/user/login', async (req, res) => {
            let request = req.body;

            let email = request.email;
            let shaPass = sha1(request.pass);
            let response = await db.Login(email, shaPass);

            res.json(response);
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