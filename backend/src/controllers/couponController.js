import Coupon from "../models/Coupon.js";

// GET ALL COUPONS
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            coupons,
        });
    } catch (error) {
        console.error(
            "Get coupons error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch coupons",
        });
    }
};

// GET SINGLE COUPON
export const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(
            req.params.id
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.json({
            success: true,
            coupon,
        });
    } catch (error) {
        console.error(
            "Get coupon error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch coupon",
        });
    }
};

// CREATE COUPON
export const createCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            startDate,
            expiryDate,
            usageLimit,
            isActive,
        } = req.body;

        if (
            !code ||
            !discountType ||
            discountValue === undefined ||
            !startDate ||
            !expiryDate
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Code, discount type, discount value, start date and expiry date are required",
            });
        }

        if (
            !["percentage", "flat"].includes(
                discountType
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid discount type",
            });
        }

        if (
            discountType === "percentage" &&
            Number(discountValue) > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Percentage discount cannot exceed 100%",
            });
        }

        if (
            new Date(expiryDate) <
            new Date(startDate)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Expiry date must be after start date",
            });
        }

        const normalizedCode =
            code.trim().toUpperCase();

        const existingCoupon =
            await Coupon.findOne({
                code: normalizedCode,
            });

        if (existingCoupon) {
            return res.status(409).json({
                success: false,
                message: "Coupon code already exists",
            });
        }

        const coupon = await Coupon.create({
            code: normalizedCode,
            description,
            discountType,
            discountValue,
            minOrderAmount:
                minOrderAmount || 0,
            maxDiscount:
                maxDiscount || null,
            startDate,
            expiryDate,
            usageLimit:
                usageLimit || 0,
            usedCount: 0,
            isActive:
                isActive !== undefined
                    ? isActive
                    : true,
        });

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon,
        });
    } catch (error) {
        console.error(
            "Create coupon error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create coupon",
        });
    }
};

// UPDATE COUPON
export const updateCoupon = async (req, res) => {
    try {
        const {
            discountType,
            discountValue,
            startDate,
            expiryDate,
        } = req.body;

        if (
            discountType &&
            !["percentage", "flat"].includes(
                discountType
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid discount type",
            });
        }

        if (
            discountType === "percentage" &&
            Number(discountValue) > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Percentage discount cannot exceed 100%",
            });
        }

        if (
            startDate &&
            expiryDate &&
            new Date(expiryDate) <
            new Date(startDate)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Expiry date must be after start date",
            });
        }

        if (req.body.code) {
            req.body.code = req.body.code
                .trim()
                .toUpperCase();
        }

        const coupon =
            await Coupon.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.json({
            success: true,
            message: "Coupon updated successfully",
            coupon,
        });
    } catch (error) {
        console.error(
            "Update coupon error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update coupon",
        });
    }
};

// DELETE COUPON
export const deleteCoupon = async (req, res) => {
    try {
        const coupon =
            await Coupon.findByIdAndDelete(
                req.params.id
            );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }

        res.json({
            success: true,
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete coupon error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete coupon",
        });
    }
};

// APPLY COUPON - CUSTOMER
export const validateCoupon = async (req, res) => {
    try {
        const {
            code,
            orderAmount,
        } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required",
            });
        }

        const coupon =
            await Coupon.findOne({
                code: code
                    .trim()
                    .toUpperCase(),
            });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon code",
            });
        }

        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message:
                    "This coupon is currently inactive",
            });
        }

        const now = new Date();

        if (now < new Date(coupon.startDate)) {
            return res.status(400).json({
                success: false,
                message:
                    "This coupon is not active yet",
            });
        }

        if (now > new Date(coupon.expiryDate)) {
            return res.status(400).json({
                success: false,
                message: "This coupon has expired",
            });
        }

        if (
            coupon.usageLimit > 0 &&
            coupon.usedCount >=
            coupon.usageLimit
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "This coupon usage limit has been reached",
            });
        }

        const amount = Number(orderAmount || 0);

        if (
            amount < coupon.minOrderAmount
        ) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount is ₹${coupon.minOrderAmount.toLocaleString(
                    "en-IN"
                )}`,
            });
        }

        let discount = 0;

        if (
            coupon.discountType ===
            "percentage"
        ) {
            discount =
                (amount *
                    coupon.discountValue) /
                100;

            if (
                coupon.maxDiscount &&
                discount > coupon.maxDiscount
            ) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        discount = Math.min(
            discount,
            amount
        );

        res.json({
            success: true,
            message: "Coupon applied successfully",
            coupon: {
                id: coupon._id,
                code: coupon.code,
                discountType:
                    coupon.discountType,
                discountValue:
                    coupon.discountValue,
            },
            discount: Math.round(
                discount * 100
            ) / 100,
        });
    } catch (error) {
        console.error(
            "Validate coupon error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to validate coupon",
        });
    }
};