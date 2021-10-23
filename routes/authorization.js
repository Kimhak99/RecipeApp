import express from "express";
import {login, register, resetPassword} from "../controllers/AuthorizationController";

const authorizationRouter = express.Router();

authorizationRouter.post("/login", login);
authorizationRouter.post("/register", register);
authorizationRouter.post("/resetpassword", resetPassword);

export default authorizationRouter;