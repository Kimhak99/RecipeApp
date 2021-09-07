import express from "express";
import * as user from "../controllers/UserController";

const userRouter = express.Router();

userRouter.post("/list", user.listUser);
userRouter.get("/get/:id", user.getUser);
userRouter.post("/create", user.addUser);
userRouter.post("/update", user.updateUser);
userRouter.delete("/delete/:id", user.deleteUser);


export default userRouter;
