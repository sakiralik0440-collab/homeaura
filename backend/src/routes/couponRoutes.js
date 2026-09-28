import express from "express";

import {
    getCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
} from "../controllers/couponController.js";

import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// CUSTOMER
router.post(
    "/validate",
    validateCoupon
);

// ADMIN
router.get(
    "/",
    adminAuthMiddleware,
    getCoupons
);

router.get(
    "/:id",
    adminAuthMiddleware,
    getCouponById
);

router.post(
    "/",
    adminAuthMiddleware,
    createCoupon
);

router.put(
    "/:id",
    adminAuthMiddleware,
    updateCoupon
);

router.delete(
    "/:id",
    adminAuthMiddleware,
    deleteCoupon
);

export default router;