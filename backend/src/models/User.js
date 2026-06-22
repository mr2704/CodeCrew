import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: (props) => `${props.value} is not a valid email address!`,
            },
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        college: {
            type: String,
            required: [true, "College is required"],
            index: true, // Indexing college for faster catalog searches/filtering
        },

        year: {
            type: String,
            required: [true, "Year is required"],
        },

        skills: {
            type: [String],
            default: [],
        },

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

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;