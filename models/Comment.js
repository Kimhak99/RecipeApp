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
    is_active: {
        type: Boolean,
        default: true,
        set: v => v || false
    }
},
    {
        timestamps: true
    },
    {
        versionKey: false
    }
);

CommentSchema.methods.fillObject = async function () {
    return {
        id: this._id,
        user_id: this.user_id ? await this.user_id.fillObject() : null,
        description: this.description,
        is_active: this.is_active
    }
}

export default mongoose.model("comment", CommentSchema);