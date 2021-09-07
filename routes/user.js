import express from "express";
import * as user from "../controllers/UserController";

const userRouter = express.Router();

userRouter.post("/list", user.listUser);


export default userRouter;