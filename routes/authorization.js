import express from "express";
import {login, register, resetPassword} from "../controllers/AuthorizationController";
import { verifyToken } from "../utils/permission";

const authorizationRouter = express.Router();

authorizationRouter.post("/login", login);
authorizationRouter.post("/register", register);
authorizationRouter.post("/resetpassword", verifyToken, resetPassword);

export default authorizationRouter;