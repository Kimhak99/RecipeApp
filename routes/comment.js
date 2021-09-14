import express from "express";
import * as comment from "../controllers/CommentController"

const commentRouter = express.Router();

commentRouter.post("/list", comment.listComment);
commentRouter.get("/get/:id", comment.getComment);
commentRouter.post("/create", comment.addComment);
commentRouter.post("/update", comment.updateComment);
commentRouter.delete("/delete/:id", comment.deleteComment);

export default commentRouter;