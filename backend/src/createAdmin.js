import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = "admin@homeaura.com";
        const password = "admin123";

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await Admin.create({
            name: "HomeAura Admin",
            email,
            password: hashedPassword,
        });

        console.log("✅ Admin created successfully");
        console.log("Email:", email);
        console.log("Password:", password);

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to create admin");
        console.error(error.message);

        process.exit(1);
    }
};

createAdmin();
