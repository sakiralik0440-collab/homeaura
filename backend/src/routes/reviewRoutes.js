
import express from "express";

import {
    getProductReviews,
    createReview,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public - get product reviews
router.get(
    "/product/:productId",
    getProductReviews
);

// Logged-in customer - create review
router.post(
    "/",
    authMiddleware,
    createReview
);

export default router;
