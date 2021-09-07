import mongoose from "mongoose";
import serverConfig from "../utils/serverConfig";

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
        default: serverConfig.blank_profile,
        set: v => v || serverConfig.blank_profile,
    }, 
    isAdmin: {
        type: Boolean,
        default: false,
        set: v => v || false
    },
    isActive: {
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
        isAdmin: this.isAdmin,
        isActive: this.isActive
    }
}

export default mongoose.model("user", UserSchema);