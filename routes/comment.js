import express from "express";
import * as comment from "../controllers/CommentController"
const commentRouter = express.Router();

commentRouter.post("/list", comment.listComment);

export default commentRouter;