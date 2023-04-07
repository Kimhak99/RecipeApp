import express from "express";
import * as recipe from "../controllers/RecipeController";

const recipeRouter = express.Router();

recipeRouter.post("/list", recipe.listRecipeV2);
recipeRouter.get("/get/:id", recipe.getRecipe);
recipeRouter.post("/create", recipe.addRecipe);
recipeRouter.post("/update", recipe.updateRecipe);
recipeRouter.delete("/delete/:id", recipe.deleteRecipe);

export default recipeRouter;