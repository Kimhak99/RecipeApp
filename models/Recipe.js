import mongoose from "mongoose";
import Comment from "./Comment";

const RecipeSchema = mongoose.Schema({
    recipe_title: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        default: [],
        set: v => v || []
    },
    ingredients: {
        type: Array,
        required: true
    },
    cooking_steps: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        default: "",
        set: v => v || ""
    },
    prep_time: {
        type: Number,
        default: 0,
        set: v => v || 0
    },
    cooking_time: {
        type: Number,
        default: 0,
        set: v => v || 0
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
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    num_of_like: {
        type: Number,
        default: 0,
        set: v => v || 0
    },
    num_of_dislike: {
        type: Number,
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

RecipeSchema.methods.fillObject = async function (index) {

    // const result = orders.map(async (p) => {
    //     const users = p.userId.map(async (p) => await userSchema.findById(p)); 

    var comments = await Promise.all(this.comments.map(p => Comment.findById({ _id: p }).populate("user_id")));
    comments = await Promise.all(comments.map(async p => (p ? await p.fillObject() : null)));

    return {
        id: this._id,
        recipe_title: this.recipe_title,
        images: this.images,
        ingredients: this.ingredients,
        cooking_steps: this.cooking_steps,
        description: this.description,
        prep_time: this.prep_time,
        cooking_time: this.cooking_time,
        category_id: this.category_id ? await this.category_id.fillObject() : null,
        comments: comments,
        user_id: this.user_id ? await this.user_id.fillObject() : null,
        num_of_like: this.num_of_like,
        num_of_dislike: this.num_of_dislike,
        is_active: this.is_active,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt

    }

}

export default mongoose.model("recipe", RecipeSchema);