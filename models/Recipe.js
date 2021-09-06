import mongoose from "mongoose";
import { array, number } from "prop-types";

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
        type: Array,
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
    return {
        id: this._id,

    }
}