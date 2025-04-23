import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

import routes from "./routes/allRoutes.js";

import sequelize from "./config/db.js";
import "./models/user/user.js";
import "./models/game/game.js";

import authenticate from './middleware/authenticate.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(express.json());
app.use(authenticate);
app.use('/api', routes);

sequelize.sync({})
    .then(()=>{
        console.log("MySQL Database Connected Successfully!!");
        app.listen(process.env.BACKEND_PORT,()=>{
            console.log("Server is Up!!");
        });
    })
    .catch((err)=>{
        console.log("Error Occurred!! : "+ err);
    });