import express, {Application} from "express";
import {DbUser} from "./models/DbUser";
import {UserController} from "./controllers/UserController";

const main = async () => {
    try {
        const PORT = 8000;
        const app: Application = express();

        app.use(express.json());
        app.use(express.static("public"));

        app.post('/user/login', async (req, res) => {
            let request = req.body;

            let username = request.username;
            let password = request.password;

            let result = {
                user_id: 0,
                username: '',
                photo_url: ''
            };

            try {
                let user_controller = new UserController();
                let user = await user_controller.Login(username, password);
                if (user) {
                    result.user_id = user.user_id;
                    result.username = user.username;
                    result.photo_url = user.photo_url;
                }
            } catch (exc) {
                console.error(exc);
            }

            res.json(result);
        });

        app.get('/test', async (req, res) => {
            res.json('test123');
        });

        app.listen(PORT, () => {
            console.log('server running');
        });
    }
    catch (e) {
        console.log(e);
    }
}
main();
