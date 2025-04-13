import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Email is required"],
        minlength: [3, "Username must be at least 3 characters"],
        trim: true,
        lowercase: true
    },
    email_address: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false,
    },
}, {
    timestamps: true
});


const User = mongoose.model("User", userSchema);
export default User;