import express from "express"
import bodyParser from "body-parser"
import cors from 'cors';
import sequelize from "./config/db.js";
import routes from "./routes/allRoutes.js"
import "./models/user/user.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"))
app.use(express.urlencoded({extended:true}));
app.use('/api/user', routes);

sequelize.sync({ logging: console.log })
    .then(()=>{
        console.log("Database Connected Successfully!!")
        app.listen(3000,()=>{
            console.log("Server is Up!! at http://localhost/3000")
        })
    })
    .catch((err)=>{
        console.log("Error Occurred!! : "+ err)
    })