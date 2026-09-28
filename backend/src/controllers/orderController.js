import Order from "../models/Order.js";

// =====================================================
// CREATE ORDER - CUSTOMER
// =====================================================
export const createOrder = async (req, res) => {
    try {
        const {
            customer,
            items,
            subtotal,
            delivery,
            couponCode,
            discount,
            total,
            paymentMethod,
            deliveryTime,
        } = req.body;

        if (
            !customer ||
            !items ||
            !items.length ||
            subtotal === undefined ||
            total === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required order information",
            });
        }

        const orderId = `HA${Date.now()
            .toString()
            .slice(-8)}`;

        const order = await Order.create({
            orderId,
            customer,
            items,
            subtotal,
            delivery: delivery || 0,
            couponCode: couponCode || null,
            discount: discount || 0,
            total,
            paymentMethod: paymentMethod || "cod",
            deliveryTime:
                deliveryTime || "5–7 business days",
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    } catch (error) {
        console.error("Create order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create order",
        });
    }
};


// =====================================================
// GET ALL ORDERS
// CUSTOMER / ADMIN
// =====================================================
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Get orders error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
        });
    }
};


// =====================================================
// GET SINGLE ORDER
// =====================================================
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Get order error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
        });
    }
};


// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const allowedStatuses = [
            "placed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
        ];

        if (!orderStatus) {
            return res.status(400).json({
                success: false,
                message: "Order status is required",
            });
        }

        if (!allowedStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status",
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                orderId: req.params.orderId,
            },
            {
                orderStatus,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            order,
        });
    } catch (error) {
        console.error(
            "Update order status error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update order status",
        });
    }
};
