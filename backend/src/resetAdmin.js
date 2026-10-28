
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

const resetAdmin = async () => {
  try {
    const email = process.env.ADMIN_RESET_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_RESET_PASSWORD;

    if (!process.env.MONGODB_URI || !email || !password) {
      throw new Error("Required environment variables are missing.");
    }

    if (password.length < 12) {
      throw new Error("Use a new password of at least 12 characters.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.findOneAndUpdate(
      { email },
      {
        $set: {
          name: "HomeAura Admin",
          email,
          password: hashedPassword,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log("Admin password reset successful.");
  } catch (error) {
    console.error("Admin reset failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
};

resetAdmin();
