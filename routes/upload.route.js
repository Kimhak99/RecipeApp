import express from "express";
import UploadController from "../controllers/UploadController";
import { verifyToken } from "../utils/permission";
import upload from "../utils/upload";

const uploadRouter = express.Router();

uploadRouter.post("/upload/signup", upload.single("file"), UploadController.UploadFile);
uploadRouter.post("/upload", verifyToken, upload.single("file"), UploadController.UploadFile);
uploadRouter.post("/uploads", verifyToken, upload.array("file"), UploadController.UploadFile);
uploadRouter.delete("/file/:filename", verifyToken, UploadController.DeleteFile);
uploadRouter.get("/objfile/:filename", verifyToken, UploadController.GetFileObject);
uploadRouter.get("/file/:filename", UploadController.GetFile);

export default uploadRouter;