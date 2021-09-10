import mongoose from "mongoose";
import userRouter from "./user";
import commentRouter from "./comment";
import categoryRouter from "./category";
import recipeRouter from "./recipe";
import authorizationRouter from "./authorization";
import { verifyToken } from "../utils/permission";

function routes(app){
    //dont have any route
    // app.use("/", (req, res) => {

    //     const testSchema = new mongoose.Schema(
    //         {name: String},
    //         {
    //             timestamps : true,
    //         }
    //     );
    //     const Test = mongoose.model("Test", testSchema);
    //     const temp = new Test();

    //     temp.name = "add to recipe_app db";
    //     temp.save();

    //     console.log(temp);
    //     /**
    //      * it like we want you (mongoose) to connect to this url, then create db with this "recipeApp" name and keep on listen to that url
    //      */

    //     res.send("Hello World")
    // }); 

    app.use("/user", userRouter);
    app.use("/comment", commentRouter);
    app.use("/category", verifyToken, categoryRouter);
    app.use("/recipe", recipeRouter);
    app.use("", authorizationRouter);
}

export default routes;