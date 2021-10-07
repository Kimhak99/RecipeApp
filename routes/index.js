import userRouter from "./user";
import commentRouter from "./comment";
import categoryRouter from "./category";
import recipeRouter from "./recipe";
import authorizationRouter from "./authorization";
import { verifyToken } from "../utils/permission";
import uploadRouter from "./upload.route";

function routes(app) {
    app.use("/user", userRouter);
    app.use("/comment", commentRouter);
    app.use("/category", verifyToken, categoryRouter);
    app.use("/recipe", recipeRouter);
    app.use("", authorizationRouter);
    app.use("/", uploadRouter);
}

export default routes;