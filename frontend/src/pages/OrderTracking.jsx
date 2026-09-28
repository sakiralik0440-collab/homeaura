import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const trackingSteps = [
    {
        key: "placed",
        label: "Order Placed",
        icon: "✓",
    },
    {
        key: "confirmed",
        label: "Confirmed",
        icon: "✓",
    },
    {
        key: "shipped",
        label: "Shipped",
        icon: "✓",
    },
    {
        key: "out_for_delivery",
        label: "Out for Delivery",
        icon: "🚚",
    },
    {
        key: "delivered",
        label: "Delivered",
        icon: "✓",
    },
];

const statusOrder = [
    "placed",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
];

function normalizeStatus(status) {
    const value = String(status || "")
        .toLowerCase()
        .trim();

    if (value === "pending") {
        return "placed";
    }

    if (
        value === "processing" ||
        value === "confirmed"
    ) {
        return "confirmed";
    }

    if (
        value === "out-for-delivery" ||
        value === "out for delivery" ||
        value === "out_for_delivery"
    ) {
        return "out_for_delivery";
    }

    if (value === "cancelled" || value === "canceled") {
        return "cancelled";
    }

    if (value === "delivered") {
        return "delivered";
    }

    if (value === "shipped") {
        return "shipped";
    }

    return "placed";
}

function formatDate(date) {
    if (!date) return "—";

    try {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    } catch {
        return "—";
    }
}

function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString(
        "en-IN"
    )}`;
}

function getCustomerName(order) {
    return (
        order?.customer?.name ||
        order?.customerName ||
        order?.shippingAddress?.name ||
        "Customer"
    );
}

function getAddress(order) {
    const address =
        order?.shippingAddress ||
        order?.address ||
        {};

    if (typeof address === "string") {
        return address;
    }

    const parts = [
        address.name,
        address.address,
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.state,
        address.pincode ||
        address.postalCode ||
        address.zipCode,
        address.phone,
    ].filter(Boolean);

    return parts.join(", ");
}

function getProductImage(item) {
    return (
        item?.image ||
        item?.imageUrl ||
        item?.product?.image ||
        item?.product?.imageUrl ||
        "https://via.placeholder.com/120x120?text=HomeAura"
    );
}

export default function OrderTracking() {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/orders/${orderId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.message ||
                        "Unable to load order"
                    );
                }

                setOrder(
                    data?.order ||
                    data?.data ||
                    data
                );
            } catch (err) {
                setError(
                    err.message ||
                    "Unable to load order details."
                );
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="ha-track-page">
                    <div className="ha-track-loading">
                        Loading your order...
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Navbar />

                <main className="ha-track-page">
                    <div className="ha-track-error">
                        <h2>
                            Unable to load order
                        </h2>

                        <p>
                            {error ||
                                "Order not found."}
                        </p>

                        <Link
                            to="/orders"
                            className="ha-track-btn ha-track-btn-primary"
                        >
                            My Orders
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    const currentStatus =
        normalizeStatus(
            order.orderStatus ||
            order.status
        );

    const isCancelled =
        currentStatus === "cancelled";

    const currentIndex =
        statusOrder.indexOf(
            currentStatus
        );

    const subtotal = Number(
        order.subtotal || 0
    );

    const discount = Number(
        order.discount || 0
    );

    const delivery = Number(
        order.delivery || 0
    );

    const total = Number(
        order.total ??
        subtotal -
        discount +
        delivery
    );

    let statusMessage =
        "Your order has been placed successfully.";

    if (currentStatus === "confirmed") {
        statusMessage =
            "Your order has been confirmed and is being prepared.";
    }

    if (currentStatus === "shipped") {
        statusMessage =
            "Your order has been shipped and is on its way.";
    }

    if (
        currentStatus ===
        "out_for_delivery"
    ) {
        statusMessage =
            "Your order is out for delivery.";
    }

    if (currentStatus === "delivered") {
        statusMessage =
            "Your order has been delivered successfully.";
    }

    if (isCancelled) {
        statusMessage =
            "This order has been cancelled.";
    }

    const items = Array.isArray(order.items)
        ? order.items
        : [];

    return (
        <>
            <Navbar />

            <main className="ha-track-page">
                <div className="ha-track-container">

                    {/* Header */}
                    <div className="ha-track-header">
                        <Link
                            to="/orders"
                            className="ha-track-back"
                        >
                            ← Back to My Orders
                        </Link>

                        <h1>
                            Track Your Order
                        </h1>

                        <div className="ha-track-order-meta">
                            <span>
                                Order #
                                {order.orderId ||
                                    order._id}
                            </span>

                            <span>
                                Placed on{" "}
                                {formatDate(
                                    order.createdAt
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="ha-track-card">

                        {/* Status Banner */}
                        <div className="ha-track-status-banner">
                            <h2>
                                {isCancelled
                                    ? "Order Cancelled"
                                    : currentStatus ===
                                        "delivered"
                                        ? "Order Delivered"
                                        : currentStatus ===
                                            "out_for_delivery"
                                            ? "Out for Delivery"
                                            : currentStatus ===
                                                "shipped"
                                                ? "Order Shipped"
                                                : currentStatus ===
                                                    "confirmed"
                                                    ? "Order Confirmed"
                                                    : "Order Placed"}
                            </h2>

                            <p>
                                {statusMessage}
                            </p>
                        </div>

                        {/* Tracking Timeline */}
                        {!isCancelled && (
                            <div className="ha-track-timeline">
                                {trackingSteps.map(
                                    (
                                        step,
                                        index
                                    ) => {
                                        const completed =
                                            currentIndex >=
                                            index;

                                        const active =
                                            currentIndex ===
                                            index;

                                        return (
                                            <div
                                                key={
                                                    step.key
                                                }
                                                className={`ha-track-step ${completed
                                                        ? "completed"
                                                        : ""
                                                    } ${active
                                                        ? "active"
                                                        : ""
                                                    }`}
                                            >
                                                <div className="ha-track-step-icon">
                                                    {step.icon}
                                                </div>

                                                <div className="ha-track-step-label">
                                                    {
                                                        step.label
                                                    }
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="ha-track-content">

                            {/* Delivery */}
                            <div className="ha-track-section">
                                <h3>
                                    Delivery Details
                                </h3>

                                <div className="ha-track-delivery-info">
                                    <p>
                                        <strong>
                                            Customer:
                                        </strong>{" "}
                                        {getCustomerName(
                                            order
                                        )}
                                    </p>

                                    {order
                                        ?.customer
                                        ?.email && (
                                            <p>
                                                <strong>
                                                    Email:
                                                </strong>{" "}
                                                {
                                                    order
                                                        .customer
                                                        .email
                                                }
                                            </p>
                                        )}

                                    {order
                                        ?.customer
                                        ?.phone && (
                                            <p>
                                                <strong>
                                                    Phone:
                                                </strong>{" "}
                                                {
                                                    order
                                                        .customer
                                                        .phone
                                                }
                                            </p>
                                        )}

                                    <p>
                                        <strong>
                                            Address:
                                        </strong>{" "}
                                        {getAddress(
                                            order
                                        ) ||
                                            "Address not available"}
                                    </p>

                                    {order.deliveryTime && (
                                        <p>
                                            <strong>
                                                Expected Delivery:
                                            </strong>{" "}
                                            {
                                                order.deliveryTime
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Products */}
                            <div className="ha-track-section">
                                <h3>
                                    Ordered Items
                                </h3>

                                {items.length ===
                                    0 ? (
                                    <div className="ha-track-empty-products">
                                        No product
                                        information
                                        available.
                                    </div>
                                ) : (
                                    <div className="ha-track-products">
                                        {items.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <div
                                                    className="ha-track-product"
                                                    key={
                                                        item.productId ||
                                                        item._id ||
                                                        index
                                                    }
                                                >
                                                    <img
                                                        src={getProductImage(
                                                            item
                                                        )}
                                                        alt={
                                                            item.name ||
                                                            item.product?.name ||
                                                            "Product"
                                                        }
                                                        className="ha-track-product-image"
                                                    />

                                                    <div className="ha-track-product-info">
                                                        <h3>
                                                            {item.name ||
                                                                item.product?.name ||
                                                                "HomeAura Product"}
                                                        </h3>

                                                        <p>
                                                            Qty:{" "}
                                                            {item.quantity ||
                                                                1}
                                                        </p>
                                                    </div>

                                                    <div className="ha-track-product-price">
                                                        {formatCurrency(
                                                            Number(
                                                                item.price ||
                                                                item.product?.price ||
                                                                0
                                                            ) *
                                                            Number(
                                                                item.quantity ||
                                                                1
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="ha-track-summary">
                            <div className="ha-track-summary-row">
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    {formatCurrency(
                                        subtotal
                                    )}
                                </strong>
                            </div>

                            {discount > 0 && (
                                <div className="ha-track-summary-row discount">
                                    <span>
                                        Discount
                                        {order.couponCode
                                            ? ` (${order.couponCode})`
                                            : ""}
                                    </span>

                                    <strong>
                                        -
                                        {formatCurrency(
                                            discount
                                        )}
                                    </strong>
                                </div>
                            )}

                            <div className="ha-track-summary-row">
                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    {delivery ===
                                        0
                                        ? "FREE"
                                        : formatCurrency(
                                            delivery
                                        )}
                                </strong>
                            </div>

                            <div className="ha-track-summary-row total">
                                <span>
                                    Total
                                </span>

                                <strong>
                                    {formatCurrency(
                                        total
                                    )}
                                </strong>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="ha-track-actions">
                            <Link
                                to="/orders"
                                className="ha-track-btn ha-track-btn-primary"
                            >
                                My Orders
                            </Link>

                            <Link
                                to="/shop"
                                className="ha-track-btn ha-track-btn-secondary"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
