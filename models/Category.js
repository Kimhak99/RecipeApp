import mongoose from "mongoose";

const CategorySchema = mongoose.Schema(
    {
        category_name: {
            type: String,
            required: true
        },
        image: {
            type: String,
            default: null,
            set: v => v || null
        },
        remark: {
            type: String,
            default: "",
            set: v => v || ""
        },
        is_active: {
            type: Boolean,
            default: true,
            set: v => v || true
        },
    },
    {
        timestamps = true
    },
    {
        versionKey: false
    }
);

CategorySchema.methods.fillObject = function() {
    return {
        id: this._id,
        category_name: this.category_name,
        image: this.image,
        remark: this.remark,
        is_active: this.is_active
    }
};

export default mongoose.model("category", CategorySchema);