import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    description: {
        type: String,
        reqired: true
    },
    isActive: {
        type: Boolean,
        default: true,
        set: v => v || true
    }
},
{
    timestamps = true
},
{
    versionKey: false
}
);

CommentSchema.methods.fillObject = function () {
    return {
        id: this._id,
        commentedBy: await this.user_id.fillObject(),
        description: this.description,
        isActive: this.isActive
    }
}

export default mongoose.model("comment", CommentSchema);