import express from "express";
import {login, register} from "../controllers/AuthorizationController";

const authorizationRouter = express.Router();

authorizationRouter.post("/login", login);
authorizationRouter.post("/register", register);

export default authorizationRouter;