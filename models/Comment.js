import mongoose from "mongoose";

const commentSchema = mongoose.commentSchema({
    commentedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        required: true
    },
    description: {
        type: String,
        reqired: true
    },
    isHidden: {
        type: Boolean,
        default: false,
        set: v => v || false
    }
},
{
    timestamps = true
},
{
    versionKey: false
}
);

commentSchema.methods.fillObject = function () {
    return {
        id: this._id,
        commentedBy: this.,
        description: this.description,
        isHidden: this.isHidden
    }
}

export default mongoose.model("comments", commentSchema);