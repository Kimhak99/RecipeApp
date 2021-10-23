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

    app.use(methodOverride('_method')); //wat is it for, by deafult https only support get and post, sometime, we need to use put, patch option ettc...., this makes sure that
    // others support the methods
    app.use(cors());
    app.use(express.json()); //make express support json, convert incoming and outgoing data as json before send to specify destination

    //Set Header to allow cross origin & methods
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');//what is it?, all access from anywhere
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

        //missing function
       // logRequest(req); // This is for the sake of fun TBH. and kinda helpful 
       //and this? log request to console semi logging, 
       //'production' ? 80 : 5000; //wat is it for, current node env is "development" so we can use any port as like, in production there specific port we need to set, or use 
       //the node env to check condition 
       /**
        * for instance
        *  development mode -> api_url = sth.com/api/users
        *  production mode -> api_url = sth.com/data/api/users
        * sth like that 
        */

        next();
    });

    //use Route logic from route index folder
    routes(app);

    //run the application and listen to provided port
    app.listen(port, () => console.log(`Server started on http://localhost:${port}`))
});

