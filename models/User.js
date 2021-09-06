import mongoose from "mongoose"

const userSchema = mongoose.userSchema({
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
    profileImage: {
        type: String,
        default: null,
        set: v => v || null
    }, 
    isAdmin: {
        type: Boolean,
        default: false,
        set: v => v || false
    },
    isActive: {
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
});

userSchema.methods.fillObject = function() {
    return {
        id: this._id,
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        password: this.password,
        email: this.email,
        profileImage: this.profileImage,
        isAdmin: this.isAdmin,
        isActive: this.isActive
    }
}

export default mongoose.model("user", userSchema, "user");