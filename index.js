import express from "express"
import cors from "cors"
import serverConfig from "./utils/serverConfig";
import routes from "./routes/index";
import mongoose from "mongoose";
import methodOverride from 'method-override';

const app = express();
const port = process.env.port || 5000;
mongoose.set('useFindAndModify', false);
mongoose.connect(serverConfig.db_connection, { useNewUrlParser: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;

    console.log("DB connected");

    app.use(methodOverride('_method'));
    app.use(cors());
    app.use(express.json());

    //Set Header to allow cross origin & methods
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');//all access from anywhere
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

        next();
    });

    //use Route logic from route index folder
    routes(app);

    //run the application and listen to provided port
    app.listen(port, () => console.log(`Server started on http://localhost:${port}`))
});

