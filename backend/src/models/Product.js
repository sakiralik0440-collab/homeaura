import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        room: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        oldPrice: {
            type: Number,
            default: null,
            min: 0,
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        reviews: {
            type: Number,
            default: 0,
            min: 0,
        },

        badge: {
            type: String,
            default: "",
            trim: true,
        },

        material: {
            type: String,
            default: "",
            trim: true,
        },

        color: {
            type: String,
            default: "",
            trim: true,
        },

        dimensions: {
            type: String,
            default: "",
            trim: true,
        },

        image: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        stock: {
            type: Number,
            default: 10,
            min: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
