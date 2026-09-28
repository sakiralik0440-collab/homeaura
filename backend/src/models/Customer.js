import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
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

        phone: {
            type: String,
            trim: true,
            default: "",
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            default: "customer",
            enum: ["customer"],
        },
    },
    {
        timestamps: true,
    }
);

const Customer = mongoose.model(
    "Customer",
    customerSchema
);

export default Customer;