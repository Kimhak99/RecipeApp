import mongoose from "mongoose";
import { array, number } from "prop-types";
import categorySchema from "./Category"

const RecipeSchema = mongoose.Schema({
    recipe_title: {
        type: String,
        required: true,
    },
    images: {
        type: array,
        default: [],
        set: v => v || []
    },
    ingredients: {
        type: array,
        required: true
    },
    cooking_steps: {
        type: array,
        required: true
    },
    description: {
        type: String,
        default: "",
        set: v => v || ""
    },
    prep_time: {
        type: String,
        default: "",
        set: v => v || ""
    },
    cooking_time: {
        type: String,
        default: "",
        set: v => v || ""
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: "category",
        required: true
    },
    comments: {
        type: [commentSchema],
        default: [],
        set: v => v || []
    },
    num_of_like: {
        type: number,
        default: 0,
        set: v => v || 0
    },
    num_of_dislike: {
        type: number,
        default: 0,
        set: v => v || 0
    },
    is_active: {
        type: Boolean,
        default: true,
        set: v => v || false
    },
},
{
    timestamps: true
},
{
    versionKey: false
}
);

RecipeSchema.methods.fillObjectRequest = async function () {

    // const result = orders.map(async (p) => {
    //     const users = p.userId.map(async (p) => await userSchema.findById(p)); 

    return {
        id: this._id,
        recipe_title: this.recipe_title,
        images: this.images,
        ingredients: this.ingredients,
        cooking_steps: this.cooking_steps,
        description: this.description,
        prep_time: this.prep_time,
        cooking_time: this.cooking_time,
        category_id: this.category_id,
        comments: this.comments,
        num_of_like: this.num_of_like,
        num_of_dislike: this.num_of_dislike,
        is_active: this.is_active



    }
}