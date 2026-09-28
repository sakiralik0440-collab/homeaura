import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
    {
        name: "Furniture",
        description: "Sofas, chairs, tables and beautiful furniture pieces.",
        image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=90",
        isActive: true,
    },
    {
        name: "Lighting",
        description: "Elegant lighting that creates the perfect atmosphere.",
        image:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=90",
        isActive: true,
    },
    {
        name: "Wall Decor",
        description: "Mirrors, artwork and decorative pieces for your walls.",
        image:
            "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=90",
        isActive: true,
    },
    {
        name: "Bedroom",
        description: "Beautiful bedroom furniture and pieces for better rest.",
        image:
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=90",
        isActive: true,
    },
    {
        name: "Kitchen & Dining",
        description: "Thoughtful pieces made for meals and memories.",
        image:
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90",
        isActive: true,
    },
    {
        name: "Home Accessories",
        description: "The finishing touches that make a house feel like home.",
        image:
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=90",
        isActive: true,
    },
];

const seedCategories = async () => {
    try {
        console.log("🌱 Starting HomeAura category seed...");

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB connected");

        await Category.deleteMany({});

        console.log("🗑️ Existing categories cleared");

        await Category.insertMany(categories);

        console.log(
            `✅ ${categories.length} categories inserted successfully`
        );

        console.log("🎉 Category seeding completed");

        await mongoose.connection.close();

        process.exit(0);
    } catch (error) {
        console.error("❌ Category seed failed:");
        console.error(error.message);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedCategories();
