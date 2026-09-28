import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import publicProductRoutes from "./routes/publicProductRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    "http://localhost:5173",
    "https://homeaura.vercel.app",
    "https://homeaura-git-main-sakiralik0440-collabs-projects.vercel.app",
    "https://homeaura-677k5swq3-sakiralik0440-collabs-projects.vercel.app",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(express.json());

// Uploaded product images
app.use(
    "/uploads",
    express.static(
        path.join(process.cwd(), "uploads")
    )
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "HomeAura Backend is running",
    });
});

// Order Routes
app.use("/api/orders", orderRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/admin/products", productRoutes);

app.use("/api/products", publicProductRoutes);

app.use("/api/admin/categories", categoryRoutes);

app.use("/api/reviews", reviewRoutes);

app.use(
    "/api/admin/customers",
    customerRoutes
);

app.use(
    "/api/coupons",
    couponRoutes
);

// Image Upload Routes
app.use(
    "/api/uploads",
    uploadRoutes
);

app.use("/api/auth", authRoutes);

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error(
                "❌ MONGODB_URI is missing in .env"
            );
            process.exit(1);
        }

        await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error(
            "❌ MongoDB connection failed:"
        );
        console.error(error.message);

        process.exit(1);
    }
};

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `🚀 HomeAura Backend running on http://localhost:${PORT}`
        );
    });
};

startServer();
