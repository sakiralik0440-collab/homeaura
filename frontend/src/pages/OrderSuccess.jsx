
import { Link, useLocation, Navigate } from "react-router-dom";
import {
    Check,
    Package,
    Truck,
    ArrowRight,
    ShoppingBag,
    MapPin,
    Tag,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OrderSuccess() {
    const location = useLocation();

    // Checkout sends: { state: { order: createdOrder } }
    const order = location.state?.order;

    // If user opens /order-success directly without placing an order
    if (!order) {
        return <Navigate to="/shop" replace />;
    }

    const orderId = order.orderId || "N/A";

    const customer = order.customer || {};
    const items = order.items || [];

    const subtotal = Number(order.subtotal || 0);
    const delivery = Number(order.delivery || 0);
    const discount = Number(order.discount || 0);
    const total = Number(order.total || 0);

    const deliveryTime =
        order.deliveryTime || "5–7 business days";

    const paymentMethod =
        order.paymentMethod === "online"
            ? "Online Payment"
            : "Cash on Delivery";

    return (
        <div className="order-success-page">
            <Navbar />

            <main className="order-success">

                {/* SUCCESS ICON */}

                <div className="success-icon">
                    <Check size={34} strokeWidth={2.5} />
                </div>

                <span className="success-eyebrow">
                    ORDER CONFIRMED
                </span>

                <h1>
                    Thank you for
                    <br />
                    <em>your order.</em>
                </h1>

                <p className="success-message">
                    Your order has been placed successfully.
                    We've received your request and will
                    keep you updated about its journey.
                </p>

                {/* ORDER NUMBER */}

                <div className="order-number">
                    <span>ORDER NUMBER</span>
                    <strong>#{orderId}</strong>
                </div>

                <div className="success-content">

                    {/* ORDER DETAILS */}

                    <section className="success-card">

                        <div className="success-card-heading">
                            <span>ORDER DETAILS</span>
                            <Package size={18} />
                        </div>

                        <div className="success-details">

                            <div>
                                <span>Items</span>

                                <strong>
                                    {items.reduce(
                                        (total, item) =>
                                            total +
                                            Number(item.quantity || 0),
                                        0
                                    )}{" "}
                                    {items.reduce(
                                        (total, item) =>
                                            total +
                                            Number(item.quantity || 0),
                                        0
                                    ) === 1
                                        ? "Item"
                                        : "Items"}
                                </strong>
                            </div>

                            <div>
                                <span>Subtotal</span>

                                <strong>
                                    ₹
                                    {subtotal.toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div>
                                <span>Payment</span>

                                <strong>
                                    {paymentMethod}
                                </strong>
                            </div>

                            <div>
                                <span>Delivery</span>

                                <strong>
                                    {delivery === 0
                                        ? "FREE"
                                        : `₹${delivery.toLocaleString(
                                            "en-IN"
                                        )}`}
                                </strong>
                            </div>

                        </div>

                        {/* PRICE BREAKDOWN */}

                        <div className="success-price-breakdown">

                            {order.couponCode && discount > 0 && (
                                <div className="success-price-row coupon-row">

                                    <span>
                                        <Tag size={14} />
                                        Coupon ({order.couponCode})
                                    </span>

                                    <strong>
                                        -₹
                                        {discount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>
                            )}

                            <div className="success-price-row success-total-row">

                                <span>
                                    Total Paid
                                </span>

                                <strong>
                                    ₹
                                    {total.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                            </div>

                        </div>

                    </section>

                    {/* DELIVERY ADDRESS */}

                    <section className="success-card">

                        <div className="success-card-heading">
                            <span>DELIVERY ADDRESS</span>
                            <MapPin size={18} />
                        </div>

                        <div className="success-address">

                            <strong>
                                {customer.firstName}{" "}
                                {customer.lastName}
                            </strong>

                            <p>
                                {customer.address}
                                <br />
                                {customer.city},{" "}
                                {customer.state}{" "}
                                {customer.pincode}
                            </p>

                            <span>
                                {customer.phone}
                            </span>

                        </div>

                    </section>

                    {/* DELIVERY STATUS */}

                    <section className="success-tracking">

                        <div className="tracking-heading">

                            <div>
                                <span>WHAT'S NEXT</span>

                                <h2>
                                    Your order is confirmed.
                                </h2>
                            </div>

                            <Truck size={25} />

                        </div>

                        <p className="tracking-message">
                            We'll process your order and
                            prepare it for delivery.
                        </p>

                        <div className="tracking-line">

                            <div className="tracking-step active">

                                <div>
                                    <Check size={12} />
                                </div>

                                <span>
                                    Order Placed
                                </span>

                            </div>

                            <div className="tracking-connector"></div>

                            <div className="tracking-step">

                                <div>2</div>

                                <span>
                                    Processing
                                </span>

                            </div>

                            <div className="tracking-connector"></div>

                            <div className="tracking-step">

                                <div>3</div>

                                <span>
                                    Delivered
                                </span>

                            </div>

                        </div>

                        <div className="delivery-estimate">

                            <span>
                                Estimated Delivery
                            </span>

                            <strong>
                                {deliveryTime}
                            </strong>

                        </div>

                    </section>

                </div>

                {/* ACTIONS */}

                <div className="success-actions">

                    <Link
                        to="/shop"
                        className="success-shop-btn"
                    >
                        Continue Shopping
                        <ArrowRight size={16} />
                    </Link>

                    <Link
                        to="/orders"
                        className="success-orders-btn"
                    >
                        <ShoppingBag size={16} />
                        View My Orders
                    </Link>

                </div>

            </main>

            <Footer />
        </div>
    );
}

export default OrderSuccess;
