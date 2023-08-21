import { Application } from "express";
import express from "express";
import moment from "moment";

import cluster from "cluster";
import os from "os";
import nodemailer from "nodemailer";
import fs from "fs";
import * as _ from "lodash";
import { RegisterRoutes } from "./routers/routes";
import swaggerUi from "swagger-ui-express";

// All APIs that need to be included must be imported in app.ts
import { ControllerListings } from "./controllers/ControllerListings";
import { ControllerUser } from "./controllers/ControllerUser";

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

app.listen(PORT, () => {
	console.log("server running http://127.0.0.1:8000");
});
