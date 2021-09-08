import express from "express";
import * as category from "../controllers/CategoryController";

const categoryRouter = express.Router();

categoryRouter.post("/list", category.listCategory);
categoryRouter.get("/get/:id", category.getCategory);
categoryRouter.post("/create", category.addCategory);
categoryRouter.post("/update", category.updateCategory);
categoryRouter.delete("/delete/:id", category.deleteCategory);

export default categoryRouter;