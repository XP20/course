import * as express from "express";
import {Application} from "express";
import * as fs from "fs";
import * as multer from "multer";
import {ControllerDatabase} from "./controllers/ControllerDatabase";


const main = async () => {
    try {
        const app: Application = express();
        const mult = multer();
        app.use(express.json());
        app.use(express.urlencoded({extended: true})); // get data from HTML forms
        app.use(mult.array("data"));

        await ControllerDatabase.instance.connect();
        // let session = await ControllerDatabase.instance.login(
        //     'test@example.com',
        //     'test'
        // );
        // let session = await ControllerDatabase.instance.loginOrm(
        //     'test@example.com',
        //     'test'
        // );

        app.get('/api', (req, res) => {
            let response = {
                success: true
            };
            res.json(response);
        });

        app.post('/login', async (req, res) => {
            let request = req.body;
            
            let response = {
                session_token: "",
                success: true
            };
            
            // let session = await ControllerDatabase.instance.login(
            //     request.email,
            //     request.pass
            // );
            let session = await ControllerDatabase.instance.loginOrm(
                request.email,
                request.pass
            );

            response.session_token = session.token;

            res.json(response);
        });
        
        app.post('/list_habits', async (req, res) => {
            let request = req.body;

            let response = {
                success: true,
                habits: []
            };

            let habits = await ControllerDatabase.instance.getHabits(
                request.session_token
            );
            
            for (let i = 0; i < habits.length; i++) {
                response.habits.push(habits[i].label);
            }

            res.json(response);
        });

        app.listen(
            8000,
            () => {
                // http://127.0.0.1:8000
                console.log('Server started http://localhost:8000');
            }
        )
    }
    catch (e) {
        console.log(e);
    }
}

main();