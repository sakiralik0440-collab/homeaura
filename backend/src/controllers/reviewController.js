
import Review from "../models/Review.js";

// GET REVIEWS FOR PRODUCT
export const getProductReviews = async (
    req,
    res
) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({
            productId,
            isApproved: true,
        })
            .sort({ createdAt: -1 })
            .lean();

        const totalReviews = reviews.length;

        const averageRating =
            totalReviews > 0
                ? reviews.reduce(
                    (sum, review) =>
                        sum + review.rating,
                    0
                ) / totalReviews
                : 0;

        res.json({
            success: true,
            reviews,
            totalReviews,
            averageRating:
                Math.round(
                    averageRating * 10
                ) / 10,
        });
    } catch (error) {
        console.error(
            "Get reviews error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load reviews.",
        });
    }
};

// CREATE REVIEW
export const createReview = async (
    req,
    res
) => {
    try {
        const {
            productId,
            rating,
            comment,
        } = req.body;

        if (
            !productId ||
            !rating ||
            !comment?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Product, rating and comment are required.",
            });
        }

        if (
            Number(rating) < 1 ||
            Number(rating) > 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be between 1 and 5.",
            });
        }

        const existingReview =
            await Review.findOne({
                productId: String(productId),
                customerId: req.user.id,
            });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message:
                    "You have already reviewed this product.",
            });
        }

        const review =
            await Review.create({
                productId: String(productId),
                customerId: req.user.id,
                customerName:
                    req.user.name ||
                    "Customer",
                rating: Number(rating),
                comment: comment.trim(),
            });

        res.status(201).json({
            success: true,
            message:
                "Review submitted successfully.",
            review,
        });
    } catch (error) {
        console.error(
            "Create review error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to submit review.",
        });
    }
};