import dotenv from "dotenv";

dotenv.config();
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE RAZORPAY ORDER
// =====================================================
export const createRazorpayOrder = async (req, res) => {
    try {
        const {
            amount,
            customer,
        } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount",
            });
        }

        const amountInPaise = Math.round(
            Number(amount) * 100
        );

        const receipt = `HA${Date.now()
            .toString()
            .slice(-10)}`;

        const razorpayOrder =
            await razorpay.orders.create({
                amount: amountInPaise,
                currency: "INR",
                receipt,
                notes: {
                    customerEmail:
                        customer?.email || "",
                },
            });

        res.status(201).json({
            success: true,
            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error(
            "Create Razorpay order error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create Razorpay order",
        });
    }
};


// =====================================================
// VERIFY RAZORPAY PAYMENT + CREATE HOMEAURA ORDER
// =====================================================
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !orderData
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification information",
            });
        }

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

        if (
            generatedSignature !==
            razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment signature verification failed",
            });
        }

        // Generate HomeAura order ID
        const orderId = `HA${Date.now()
            .toString()
            .slice(-8)}`;

        const order = await Order.create({
            orderId,

            customer: orderData.customer,

            items: orderData.items,

            subtotal: Number(
                orderData.subtotal
            ),

            delivery: Number(
                orderData.delivery || 0
            ),

            couponCode:
                orderData.couponCode || null,

            discount: Number(
                orderData.discount || 0
            ),

            total: Number(
                orderData.total
            ),

            paymentMethod: "online",

            paymentStatus: "paid",

            orderStatus: "placed",

            deliveryTime:
                orderData.deliveryTime ||
                "5–7 business days",
        });

        res.status(201).json({
            success: true,
            message:
                "Payment verified and order created successfully",

            order,

            payment: {
                razorpayOrderId:
                    razorpay_order_id,

                razorpayPaymentId:
                    razorpay_payment_id,
            },
        });
    } catch (error) {
        console.error(
            "Verify Razorpay payment error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Payment verification failed",
        });
    }
};
