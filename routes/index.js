import mongoose from "mongoose";

function routes(app){
    //dont have any route
    app.use("/", (req, res) => {

        const testSchema = new mongoose.Schema(
            {name: String},
            {
                timestamps : true,
            }
        );
        const Test = mongoose.model("Test", testSchema);
        const temp = new Test();

        temp.name = "add to recipe_app db";
        temp.save();

        console.log(temp);
        /**
         * it like we want you (mongoose) to connect to this url, then create db with this "recipeApp" name and keep on listen to that url
         */

        res.send("Hello World")
    }); //get the point? yes

    
}

export default routes;