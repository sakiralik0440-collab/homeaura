
import express from "express";

import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
} from "../controllers/orderController.js";

import adminAuthMiddleware from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// =====================================================
// CUSTOMER ORDER ROUTES
// =====================================================

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/:orderId", getOrderById);


// =====================================================
// ADMIN ORDER ROUTES
// =====================================================

// Update order status
router.put(
    "/:orderId/status",
    adminAuthMiddleware,
    updateOrderStatus
);

export default router;
