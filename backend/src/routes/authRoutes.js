import express from "express";

import {
    registerCustomer,
    loginCustomer,
    getCurrentCustomer,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register
router.post(
    "/register",
    registerCustomer
);

// Login
router.post(
    "/login",
    loginCustomer
);

// Current logged-in customer
router.get(
    "/me",
    authMiddleware,
    getCurrentCustomer
);

export default router;
