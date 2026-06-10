import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        college: {
            type: String,
            required: true,
        },

        year: {
            type: String,
            required: true,
        },

        skills: [
            {
                type: String,
            },
        ],

        bio: {
            type: String,
            default: "",
        },

        github: {
            type: String,
            default: "",
        },

        linkedin: {
            type: String,
            default: "",
        },

        avatar: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;