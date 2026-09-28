import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: Number,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            default: "",
        },

        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },

        customer: {
            firstName: {
                type: String,
                required: true,
            },

            lastName: {
                type: String,
                required: true,
            },

            email: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        subtotal: {
            type: Number,
            required: true,
        },

        delivery: {
            type: Number,
            default: 0,
        },

        total: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "online"],
            default: "cod",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "placed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "placed",
        },

        deliveryTime: {
            type: String,
            default: "5–7 business days",
        },

        couponCode: {
            type: String,
            default: null,
            trim: true,
            uppercase: true,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;