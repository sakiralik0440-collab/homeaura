import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

// ============================================
// CREATE JWT TOKEN
// ============================================

const generateToken = (customer) => {
    return jwt.sign(
        {
            id: customer._id,
            email: customer.email,
            role: customer.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// ============================================
// REGISTER CUSTOMER
// POST /api/auth/register
// ============================================

export const registerCustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required",
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const existingCustomer =
            await Customer.findOne({
                email: normalizedEmail,
            });

        if (existingCustomer) {
            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters",
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const customer =
            await Customer.create({
                name: name.trim(),
                email: normalizedEmail,
                phone: phone?.trim() || "",
                password: hashedPassword,
                role: "customer",
            });

        const token =
            generateToken(customer);

        res.status(201).json({
            success: true,
            message:
                "Account created successfully",
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                role: customer.role,
            },
        });
    } catch (error) {
        console.error(
            "Customer registration error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to create customer account",
        });
    }
};

// ============================================
// LOGIN CUSTOMER
// POST /api/auth/login
// ============================================

export const loginCustomer = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Email and password are required",
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const customer =
            await Customer.findOne({
                email: normalizedEmail,
            });

        if (!customer) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                customer.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }

        const token =
            generateToken(customer);

        res.json({
            success: true,
            message: "Login successful",
            token,
            customer: {
                id: customer._id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                role: customer.role,
            },
        });
    } catch (error) {
        console.error(
            "Customer login error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to login",
        });
    }
};

// ============================================
// GET CURRENT CUSTOMER
// GET /api/auth/me
// ============================================

export const getCurrentCustomer = async (
    req,
    res
) => {
    try {
        const customer =
            await Customer.findById(
                req.user.id
            ).select("-password");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message:
                    "Customer not found",
            });
        }

        res.json({
            success: true,
            customer,
        });
    } catch (error) {
        console.error(
            "Get customer error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to get customer",
        });
    }
};
