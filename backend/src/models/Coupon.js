import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        discountType: {
            type: String,
            enum: ["percentage", "flat"],
            required: true,
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },

        minOrderAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        maxDiscount: {
            type: Number,
            default: null,
            min: 0,
        },

        startDate: {
            type: Date,
            required: true,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        usageLimit: {
            type: Number,
            default: 0,
            min: 0,
        },

        usedCount: {
            type: Number,
            default: 0,
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

const Coupon = mongoose.model(
    "Coupon",
    couponSchema
);

export default Coupon;