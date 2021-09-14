import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true

    }, 

    email: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
        default: "",
        set: v => v || "",
    }, 
    is_admin: {
        type: Boolean,
        default: false,
        set: v => v || false
    },
    is_active: {
        type: Boolean,
        default: true,
        set: v => v || false
    },

},
{
    timestamps : true
},
{
    versionKey: false
});

UserSchema.methods.fillObject = function() {
    return {
        id: this._id,
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        password: this.password,
        email: this.email,
        profile_image: this.profile_image,
        is_admin: this.is_admin,
        is_active: this.is_active
    }
}

export default mongoose.model("user", UserSchema);